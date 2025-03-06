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
 * PinningService.js
 * 
 * This service provides functionality for pinning content to remote IPFS pinning services,
 * ensuring content persistence beyond CivIQ's own infrastructure. It supports multiple
 * pinning services like Pinata, Infura, and others for redundancy.
 * 
 * Pinning is a critical component of CivIQ's censorship resistance strategy, ensuring
 * content remains available even if the primary infrastructure is compromised.
 */

const axios = require('axios');
const { logger } = require('../../../utils/logger');
const { retry } = require('../../../utils/retry');

class PinningService {
  /**
   * Create a new pinning service instance
   * 
   * @param {Object} config - Pinning service configuration
   * @param {String} config.name - Name of the pinning service
   * @param {String} config.apiKey - API key for authentication
   * @param {String} config.secretKey - Secret key for authentication (if needed)
   * @param {String} config.projectId - Project ID for services like Infura
   */
  constructor(config) {
    this.name = config.name;
    this.apiKey = config.apiKey;
    this.secretKey = config.secretKey;
    this.projectId = config.projectId;
    this.projectSecret = config.projectSecret;
    this.isConnected = false;
    this.endpoint = null;
    this.headers = {};
    
    // Configure service based on name
    this.configureService();
  }

  /**
   * Configure the service based on its name
   * Sets up the appropriate API endpoints and headers
   */
  configureService() {
    switch (this.name.toLowerCase()) {
      case 'pinata':
        this.endpoint = 'https://api.pinata.cloud';
        this.pinEndpoint = `${this.endpoint}/pinning/pinByHash`;
        this.unpinEndpoint = `${this.endpoint}/pinning/unpin`;
        this.listEndpoint = `${this.endpoint}/pinning/pinList`;
        this.headers = {
          'pinata_api_key': this.apiKey,
          'pinata_secret_api_key': this.secretKey,
          'Content-Type': 'application/json'
        };
        break;
        
      case 'infura':
        this.endpoint = 'https://ipfs.infura.io:5001/api/v0';
        this.pinEndpoint = `${this.endpoint}/pin/add`;
        this.unpinEndpoint = `${this.endpoint}/pin/rm`;
        this.listEndpoint = `${this.endpoint}/pin/ls`;
        // Infura uses basic auth
        this.headers = {
          'Authorization': `Basic ${Buffer.from(`${this.projectId}:${this.projectSecret}`).toString('base64')}`,
          'Content-Type': 'application/json'
        };
        break;
        
      // Add more services as needed
      default:
        logger.warn(`Unknown pinning service: ${this.name}`);
        break;
    }
  }

  /**
   * Initialize the pinning service
   * Tests connectivity and sets up any necessary state
   */
  async init() {
    try {
      // Test connection by listing pins
      await this.testConnection();
      this.isConnected = true;
      logger.info(`${this.name} pinning service initialized successfully`);
      return true;
    } catch (error) {
      logger.error(`Failed to initialize ${this.name} pinning service`, { error: error.message });
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Test the connection to the pinning service
   */
  async testConnection() {
    try {
      let testEndpoint;
      let params = {};
      
      switch (this.name.toLowerCase()) {
        case 'pinata':
          testEndpoint = `${this.endpoint}/data/testAuthentication`;
          break;
        case 'infura':
          testEndpoint = this.listEndpoint;
          params = { arg: [] }; // Empty list to just test auth
          break;
        default:
          testEndpoint = this.listEndpoint;
          break;
      }
      
      const response = await axios({
        method: 'get',
        url: testEndpoint,
        headers: this.headers,
        params
      });
      
      if (response.status !== 200) {
        throw new Error(`${this.name} responded with status ${response.status}`);
      }
      
      return true;
    } catch (error) {
      logger.error(`Connection test to ${this.name} failed`, { error: error.message });
      throw new Error(`Connection to ${this.name} failed: ${error.message}`);
    }
  }

  /**
   * Pin content to the remote pinning service
   * 
   * @param {String} cid - Content identifier to pin
   * @param {Object} options - Pinning options
   * @param {String} options.name - Optional name for the pinned content
   * @param {Array} options.tags - Optional tags for the pinned content
   * @returns {Object} - Result of the pinning operation
   */
  async pinContent(cid, options = {}) {
    if (!this.isConnected) {
      await this.init();
      if (!this.isConnected) {
        throw new Error(`${this.name} pinning service is not connected`);
      }
    }
    
    try {
      let response;
      
      // Handle different service implementations
      switch (this.name.toLowerCase()) {
        case 'pinata': {
          const pinataOptions = {
            pinataMetadata: {
              name: options.name || `CivIQ_${cid}`,
              keyvalues: {}
            }
          };
          
          // Add tags if provided
          if (options.tags && Array.isArray(options.tags)) {
            options.tags.forEach(tag => {
              pinataOptions.pinataMetadata.keyvalues[tag] = true;
            });
          }
          
          // Add content ID if provided
          if (options.contentId) {
            pinataOptions.pinataMetadata.keyvalues.contentId = options.contentId;
          }
          
          response = await retry(async () => {
            return await axios.post(this.pinEndpoint, {
              hashToPin: cid,
              ...pinataOptions
            }, {
              headers: this.headers
            });
          }, 3);
          
          return {
            service: this.name,
            cid,
            requestId: response.data.id || cid,
            status: response.data.status || 'pinned',
            timestamp: new Date().toISOString()
          };
        }
          
        case 'infura': {
          response = await retry(async () => {
            return await axios.post(`${this.pinEndpoint}?arg=${cid}`, {}, {
              headers: this.headers
            });
          }, 3);
          
          return {
            service: this.name,
            cid,
            requestId: cid, // Infura doesn't provide a separate ID
            status: 'pinned',
            timestamp: new Date().toISOString()
          };
        }
          
        default:
          throw new Error(`Unsupported pinning service: ${this.name}`);
      }
    } catch (error) {
      logger.error(`Failed to pin content to ${this.name}`, { 
        cid,
        error: error.message,
        response: error.response?.data
      });
      throw new Error(`Pinning to ${this.name} failed: ${error.message}`);
    }
  }

  /**
   * Unpin content from the remote pinning service
   * 
   * @param {String} cid - Content identifier to unpin
   * @returns {Object} - Result of the unpinning operation
   */
  async unpinContent(cid) {
    if (!this.isConnected) {
      await this.init();
      if (!this.isConnected) {
        throw new Error(`${this.name} pinning service is not connected`);
      }
    }
    
    try {
      let response;
      
      // Handle different service implementations
      switch (this.name.toLowerCase()) {
        case 'pinata':
          response = await axios.delete(`${this.unpinEndpoint}/${cid}`, {
            headers: this.headers
          });
          break;
          
        case 'infura':
          response = await axios.post(`${this.unpinEndpoint}?arg=${cid}`, {}, {
            headers: this.headers
          });
          break;
          
        default:
          throw new Error(`Unsupported pinning service: ${this.name}`);
      }
      
      return {
        service: this.name,
        cid,
        status: 'unpinned',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Check if it's already unpinned
      if (error.response && error.response.status === 404) {
        return {
          service: this.name,
          cid,
          status: 'not_pinned',
          timestamp: new Date().toISOString()
        };
      }
      
      logger.error(`Failed to unpin content from ${this.name}`, { 
        cid,
        error: error.message,
        response: error.response?.data
      });
      throw new Error(`Unpinning from ${this.name} failed: ${error.message}`);
    }
  }

  /**
   * List pinned content on the remote pinning service
   * 
   * @param {Object} options - Filtering options
   * @param {Number} options.limit - Maximum number of results
   * @param {String} options.status - Filter by status
   * @returns {Array} - List of pinned content
   */
  async listPins(options = {}) {
    if (!this.isConnected) {
      await this.init();
      if (!this.isConnected) {
        throw new Error(`${this.name} pinning service is not connected`);
      }
    }
    
    try {
      let response;
      
      // Handle different service implementations
      switch (this.name.toLowerCase()) {
        case 'pinata': {
          const queryParams = new URLSearchParams();
          if (options.limit) queryParams.append('limit', options.limit);
          if (options.status) queryParams.append('status', options.status);
          
          const url = `${this.listEndpoint}?${queryParams.toString()}`;
          response = await axios.get(url, {
            headers: this.headers
          });
          
          return response.data.rows.map(pin => ({
            service: this.name,
            cid: pin.ipfs_pin_hash,
            name: pin.metadata?.name,
            status: pin.status,
            created: pin.date_pinned
          }));
        }
          
        case 'infura': {
          response = await axios.post(this.listEndpoint, {}, {
            headers: this.headers
          });
          
          // Format Infura response
          const pins = [];
          for (const [cid, pinData] of Object.entries(response.data.Keys || {})) {
            pins.push({
              service: this.name,
              cid,
              status: 'pinned',
              type: pinData.Type
            });
          }
          
          return pins;
        }
          
        default:
          throw new Error(`Unsupported pinning service: ${this.name}`);
      }
    } catch (error) {
      logger.error(`Failed to list pins from ${this.name}`, { 
        error: error.message,
        response: error.response?.data
      });
      throw new Error(`Listing pins from ${this.name} failed: ${error.message}`);
    }
  }

  /**
   * Get the status of a specific pinned CID
   * 
   * @param {String} cid - Content identifier to check
   * @returns {Object} - Pin status
   */
  async getPinStatus(cid) {
    if (!this.isConnected) {
      await this.init();
      if (!this.isConnected) {
        throw new Error(`${this.name} pinning service is not connected`);
      }
    }
    
    try {
      let response;
      
      // Handle different service implementations
      switch (this.name.toLowerCase()) {
        case 'pinata':
          response = await axios.get(`${this.listEndpoint}?hashContains=${cid}`, {
            headers: this.headers
          });
          
          // Check if the pin exists
          const pins = response.data.rows;
          if (pins.length === 0) {
            return {
              service: this.name,
              cid,
              status: 'not_pinned',
              timestamp: new Date().toISOString()
            };
          }
          
          // Return the status of the first matching pin
          const pin = pins[0];
          return {
            service: this.name,
            cid: pin.ipfs_pin_hash,
            name: pin.metadata?.name,
            status: pin.status,
            created: pin.date_pinned
          };
          
        case 'infura':
          response = await axios.post(`${this.listEndpoint}?arg=${cid}`, {}, {
            headers: this.headers
          });
          
          // Check if the pin exists
          const keys = response.data.Keys || {};
          if (!keys[cid]) {
            return {
              service: this.name,
              cid,
              status: 'not_pinned',
              timestamp: new Date().toISOString()
            };
          }
          
          return {
            service: this.name,
            cid,
            status: 'pinned',
            type: keys[cid].Type,
            timestamp: new Date().toISOString()
          };
          
        default:
          throw new Error(`Unsupported pinning service: ${this.name}`);
      }
    } catch (error) {
      // If we get a 404, it means the pin doesn't exist
      if (error.response && error.response.status === 404) {
        return {
          service: this.name,
          cid,
          status: 'not_pinned',
          timestamp: new Date().toISOString()
        };
      }
      
      logger.error(`Failed to get pin status from ${this.name}`, { 
        cid,
        error: error.message,
        response: error.response?.data
      });
      throw new Error(`Getting pin status from ${this.name} failed: ${error.message}`);
    }
  }
}

module.exports = PinningService;