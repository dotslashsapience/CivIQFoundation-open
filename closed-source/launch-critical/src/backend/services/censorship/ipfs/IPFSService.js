/**
 * CivIQ Platform - A civic discourse platform designed to foster meaningful, evidence-based discussions
 * 
 * Copyright (C) 2025 CivIQ Platform
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version, with the additional terms of
 * CivIQ's Mission-Aligned Usage Clauses.
 * 
 * MISSION-ALIGNED USAGE: This software may only be used for civic engagement,
 * misinformation prevention, educational research, and transparency initiatives.
 * Usage for profit-driven social media, misinformation, censorship, surveillance,
 * or commercial purposes is expressly prohibited.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 * 
 * The complete license terms, including the Mission-Aligned Usage Clauses,
 * can be found in the LICENSE.md file at the root of this repository.
 */

/**
 * IPFSService.js
 * 
 * This service provides core functionality for interacting with the IPFS network
 * as part of CivIQ's censorship resistance strategy. It handles content storage,
 * retrieval, and pinning across multiple IPFS nodes to ensure content persistence.
 * 
 * The service abstracts away the complexities of IPFS interactions, providing
 * a simple interface for storing and retrieving content while ensuring proper
 * distribution and redundancy.
 */

const ipfsClient = require('ipfs-http-client');
const { Buffer } = require('buffer');
const { logger } = require('../../../utils/logger');
const config = require('../../../../../config/censorship.config');
const { retry } = require('../../../utils/retry');
const PinningService = require('./PinningService');
const { createHash } = require('crypto');

class IPFSService {
  constructor() {
    this.initialized = false;
    this.ipfs = null;
    this.pinningServices = [];
    this.gateway = config.storage.providers.find(p => p.name === 'ipfs')?.config.gateway || 'https://ipfs.civiq.io';
    this.init();
  }

  /**
   * Initialize the IPFS service by connecting to the IPFS node
   * and setting up pinning services
   */
  async init() {
    try {
      // Get IPFS configuration
      const ipfsConfig = config.storage.providers.find(p => p.name === 'ipfs');
      
      if (!ipfsConfig || !ipfsConfig.enabled) {
        logger.warn('IPFS service is disabled in config');
        return;
      }
      
      // Connect to the IPFS node
      const apiUrl = ipfsConfig.config.apiUrl;
      this.ipfs = ipfsClient.create({ url: apiUrl });
      
      // Test connection
      await this.ipfs.version();
      
      // Initialize pinning services
      if (ipfsConfig.config.pinningServices) {
        for (const pinningConfig of ipfsConfig.config.pinningServices) {
          if (pinningConfig.enabled) {
            const pinningService = new PinningService(pinningConfig);
            await pinningService.init();
            this.pinningServices.push(pinningService);
          }
        }
      }
      
      // Set initialization flag
      this.initialized = true;
      logger.info('IPFS service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize IPFS service', { error: error.message });
      // We don't throw here to allow the service to attempt operations
      // even if initialization failed (it will try to reconnect)
    }
  }

  /**
   * Ensures the service is initialized before any operation
   */
  async ensureInitialized() {
    if (!this.initialized) {
      await this.init();
      if (!this.initialized) {
        throw new Error('IPFS service is not initialized');
      }
    }
  }

  /**
   * Add content to IPFS and pin it for persistence
   * 
   * @param {String|Buffer|Object} content - Content to store on IPFS
   * @param {Object} options - Storage options
   * @param {String} options.contentType - MIME type of the content
   * @param {Boolean} options.pin - Whether to pin the content (default: true)
   * @param {String} options.name - Optional name for the content
   * @param {String} options.contentId - ID of the content in the CivIQ system
   * @returns {Object} - IPFS addition result with CID
   */
  async addContent(content, options = {}) {
    await this.ensureInitialized();
    
    try {
      // Default options
      const defaultOptions = {
        pin: true,
        contentType: 'text/plain',
      };
      options = { ...defaultOptions, ...options };
      
      // Convert content to Buffer if needed
      let contentBuffer;
      if (Buffer.isBuffer(content)) {
        contentBuffer = content;
      } else if (typeof content === 'string') {
        contentBuffer = Buffer.from(content);
      } else if (typeof content === 'object') {
        contentBuffer = Buffer.from(JSON.stringify(content));
        if (!options.contentType) {
          options.contentType = 'application/json';
        }
      } else {
        throw new Error('Unsupported content type');
      }
      
      // Generate content hash for verification
      const contentHash = createHash('sha256').update(contentBuffer).digest('hex');
      
      // Add content to IPFS
      const result = await retry(async () => {
        return await this.ipfs.add(contentBuffer, {
          pin: options.pin,
          wrapWithDirectory: !!options.name,
        });
      }, 3);
      
      const cid = result.cid.toString();
      logger.info('Content added to IPFS', { cid, contentId: options.contentId });
      
      // Pin content on remote pinning services for redundancy
      await this.pinToServices(cid, options);
      
      // Return result with additional metadata
      return {
        cid,
        size: result.size,
        gateway: `${this.gateway}/ipfs/${cid}`,
        contentHash,
        timestamp: new Date().toISOString(),
        pins: this.pinningServices.map(service => service.name)
      };
    } catch (error) {
      logger.error('Failed to add content to IPFS', { 
        error: error.message,
        contentId: options.contentId
      });
      throw new Error(`IPFS content addition failed: ${error.message}`);
    }
  }

  /**
   * Pin content to multiple pinning services for redundancy
   * 
   * @param {String} cid - Content identifier to pin
   * @param {Object} options - Pinning options
   * @returns {Array} - Result of pinning operations
   */
  async pinToServices(cid, options = {}) {
    await this.ensureInitialized();
    
    // Skip if no pinning services configured
    if (this.pinningServices.length === 0) {
      logger.warn('No pinning services configured, content may not persist');
      return [];
    }
    
    const pinResults = [];
    const minPinningServices = config.storage.providers.find(p => p.name === 'ipfs')?.config.minPinningServices || 1;
    
    // Pin to all configured services in parallel
    const pinPromises = this.pinningServices.map(service => 
      service.pinContent(cid, options)
        .then(result => {
          pinResults.push({ 
            service: service.name,
            success: true,
            requestId: result.requestId
          });
          return result;
        })
        .catch(error => {
          logger.error(`Failed to pin content on ${service.name}`, { 
            cid, 
            error: error.message 
          });
          pinResults.push({ 
            service: service.name,
            success: false,
            error: error.message
          });
          return null;
        })
    );
    
    await Promise.all(pinPromises);
    
    // Check if we have enough successful pins
    const successfulPins = pinResults.filter(r => r.success).length;
    if (successfulPins < minPinningServices) {
      logger.warn(`Content not pinned on enough services (${successfulPins}/${minPinningServices})`, { cid });
    } else {
      logger.info(`Content pinned on ${successfulPins} services`, { cid });
    }
    
    return pinResults;
  }

  /**
   * Get content from IPFS by CID
   * 
   * @param {String} cid - Content identifier to retrieve
   * @param {Object} options - Retrieval options
   * @returns {Buffer} - Retrieved content as a Buffer
   */
  async getContent(cid, options = {}) {
    await this.ensureInitialized();
    
    try {
      // First check if content is available locally
      const chunks = [];
      for await (const chunk of this.ipfs.cat(cid, options)) {
        chunks.push(chunk);
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      logger.error('Failed to get content from IPFS', { cid, error: error.message });
      throw new Error(`IPFS content retrieval failed: ${error.message}`);
    }
  }

  /**
   * Check if content is available on IPFS
   * 
   * @param {String} cid - Content identifier to check
   * @returns {Boolean} - Whether the content is available
   */
  async isContentAvailable(cid) {
    await this.ensureInitialized();
    
    try {
      // Try to get the content stat
      await this.ipfs.block.stat(cid);
      return true;
    } catch (error) {
      // Content not found locally, check pins
      try {
        const pins = await this.ipfs.pin.ls({ paths: [cid] });
        for await (const pin of pins) {
          if (pin.cid.toString() === cid) {
            return true;
          }
        }
        return false;
      } catch (error) {
        return false;
      }
    }
  }

  /**
   * Remove content from IPFS (unpin)
   * Note: This only removes the local pin, content may still be available on the network
   * 
   * @param {String} cid - Content identifier to unpin
   * @param {Object} options - Removal options
   * @returns {Boolean} - Whether the operation was successful
   */
  async removeContent(cid, options = {}) {
    await this.ensureInitialized();
    
    // Check if we should also remove from pinning services
    const removeFromPinningServices = options.removeFromPinningServices || false;
    
    try {
      // Unpin locally
      await this.ipfs.pin.rm(cid);
      logger.info('Content unpinned from local node', { cid });
      
      // Unpin from remote pinning services if requested
      if (removeFromPinningServices && this.pinningServices.length > 0) {
        const unpinPromises = this.pinningServices.map(service => 
          service.unpinContent(cid)
            .catch(error => {
              logger.error(`Failed to unpin content from ${service.name}`, { 
                cid, 
                error: error.message 
              });
            })
        );
        
        await Promise.all(unpinPromises);
        logger.info('Content unpinned from remote services', { cid });
      }
      
      return true;
    } catch (error) {
      logger.error('Failed to remove content from IPFS', { cid, error: error.message });
      return false;
    }
  }

  /**
   * Get a public gateway URL for accessing content
   * 
   * @param {String} cid - Content identifier
   * @param {String} path - Optional path within a directory
   * @returns {String} - Gateway URL
   */
  getGatewayUrl(cid, path = '') {
    const pathComponent = path ? `/${path}` : '';
    return `${this.gateway}/ipfs/${cid}${pathComponent}`;
  }

  /**
   * Get the status of the IPFS node
   * 
   * @returns {Object} - Node status information
   */
  async getNodeStatus() {
    await this.ensureInitialized();
    
    try {
      const [version, id, peers] = await Promise.all([
        this.ipfs.version(),
        this.ipfs.id(),
        this.ipfs.swarm.peers()
      ]);
      
      const peerCount = peers.length;
      
      return {
        version: version.version,
        id: id.id,
        peerCount,
        pinningServices: this.pinningServices.map(service => ({
          name: service.name,
          status: service.isConnected ? 'connected' : 'disconnected'
        })),
        gateway: this.gateway
      };
    } catch (error) {
      logger.error('Failed to get IPFS node status', { error: error.message });
      throw new Error(`IPFS node status check failed: ${error.message}`);
    }
  }
}

// Create a singleton instance
const ipfsService = new IPFSService();

module.exports = ipfsService;