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
 * TorService.js
 * 
 * This service provides functionality for managing Tor hidden services
 * as part of CivIQ's censorship resistance strategy. It handles the
 * configuration, deployment, and monitoring of .onion services to 
 * ensure platform accessibility in restrictive environments.
 * 
 * The service provides an automated way to create and manage Tor hidden
 * services, making CivIQ accessible via the Tor network even when
 * conventional access is blocked.
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const util = require('util');
const axios = require('axios');
const { logger } = require('../../../utils/logger');
const config = require('../../../../../config/censorship.config');
const { retry } = require('../../../utils/retry');

// Promisify exec for async/await usage
const execAsync = util.promisify(exec);

class TorService {
  constructor() {
    // Get tor configuration
    const torConfig = config.alternativeRouting.tor;
    
    this.enabled = torConfig?.enabled || false;
    this.onionAddress = torConfig?.onionAddress || null;
    this.controlPort = torConfig?.controlPort || 9051;
    this.controlPassword = torConfig?.controlPassword || null;
    this.autoConfig = torConfig?.autoConfig || false;
    
    // Service state
    this.isRunning = false;
    this.lastCheck = null;
    this.serviceDirectory = null;
    this.statusCheckInterval = null;
    
    // Initialize the service if enabled
    if (this.enabled) {
      this.init();
    }
  }

  /**
   * Initialize the Tor service
   * Sets up the hidden service if auto-configuration is enabled
   */
  async init() {
    try {
      logger.info('Initializing Tor service');
      
      // Check if Tor is installed and running
      await this.checkTorAvailability();
      
      // If auto-configuration is enabled, set up the hidden service
      if (this.autoConfig) {
        await this.configureHiddenService();
      }
      
      // Start periodic status checking
      this.startStatusChecks();
      
      logger.info('Tor service initialized successfully', {
        onionAddress: this.onionAddress,
        autoConfig: this.autoConfig
      });
    } catch (error) {
      logger.error('Failed to initialize Tor service', { error: error.message });
      this.isRunning = false;
    }
  }

  /**
   * Check if Tor is installed and running on the system
   */
  async checkTorAvailability() {
    try {
      // Check if Tor is installed
      await execAsync('which tor');
      
      // Check if Tor is running
      const { stdout } = await execAsync('ps aux | grep tor | grep -v grep');
      
      if (!stdout.trim()) {
        throw new Error('Tor is installed but not running');
      }
      
      // If we reach here, Tor is available
      this.isRunning = true;
      logger.info('Tor is available and running');
      return true;
    } catch (error) {
      logger.error('Tor is not available', { error: error.message });
      this.isRunning = false;
      throw new Error(`Tor check failed: ${error.message}`);
    }
  }

  /**
   * Configure a Tor hidden service automatically
   * This sets up a new hidden service or uses an existing one
   */
  async configureHiddenService() {
    try {
      // If we already have an onion address, verify it's valid
      if (this.onionAddress) {
        if (!this.isValidOnionAddress(this.onionAddress)) {
          throw new Error(`Invalid onion address: ${this.onionAddress}`);
        }
        
        logger.info('Using existing onion address', { onionAddress: this.onionAddress });
        return this.onionAddress;
      }
      
      // We need to create a new hidden service
      logger.info('Setting up new Tor hidden service');
      
      // Determine the service directory
      const baseDir = process.env.TOR_SERVICE_DIR || '/var/lib/tor/hidden_services';
      this.serviceDirectory = path.join(baseDir, 'civiq_service');
      
      // Check if service directory exists
      try {
        await fs.access(this.serviceDirectory);
        // Directory exists, try to read the hostname file
        const hostname = await fs.readFile(
          path.join(this.serviceDirectory, 'hostname'), 
          'utf8'
        );
        this.onionAddress = hostname.trim();
        
        logger.info('Found existing hidden service', { onionAddress: this.onionAddress });
        return this.onionAddress;
      } catch (error) {
        // Directory doesn't exist or we can't access it
        // We need to create a new service using the Tor controller
        logger.info('No existing service found, creating a new one');
      }
      
      // Use the Tor control protocol to create a new hidden service
      if (!this.controlPassword) {
        throw new Error('Tor control password is required for auto-configuration');
      }
      
      // Create the service using the Tor control protocol
      const onionAddress = await this.createHiddenServiceViaTorControl();
      this.onionAddress = onionAddress;
      
      logger.info('Created new Tor hidden service', { onionAddress });
      return onionAddress;
    } catch (error) {
      logger.error('Failed to configure Tor hidden service', { error: error.message });
      throw new Error(`Hidden service configuration failed: ${error.message}`);
    }
  }

  /**
   * Create a hidden service using the Tor control protocol
   * This requires the Tor control port to be accessible and authenticated
   */
  async createHiddenServiceViaTorControl() {
    try {
      // Connect to the Tor control port
      const net = require('net');
      const client = new net.Socket();
      
      return new Promise((resolve, reject) => {
        let dataBuffer = '';
        
        client.connect(this.controlPort, '127.0.0.1', () => {
          logger.debug('Connected to Tor control port');
        });
        
        client.on('data', (data) => {
          const response = data.toString();
          dataBuffer += response;
          
          // Check for authentication success
          if (response.includes('250 OK')) {
            // Send the command to create a hidden service
            const servicePort = 80; // Web port
            const targetPort = 3000; // Our application port
            client.write(`ADD_ONION NEW:BEST ServicePort=${servicePort},127.0.0.1:${targetPort}\r\n`);
          } 
          // Check for hidden service creation success
          else if (response.includes('250-ServiceID=')) {
            // Extract the onion address
            const matches = dataBuffer.match(/250-ServiceID=([a-z2-7]{16}|[a-z2-7]{56})/);
            if (matches && matches[1]) {
              const serviceId = matches[1];
              const onionAddress = `${serviceId}.onion`;
              client.write('QUIT\r\n');
              client.end();
              resolve(onionAddress);
            }
          }
          // Check for authentication required
          else if (response.includes('515 Authentication required')) {
            // Send authentication command
            client.write(`AUTHENTICATE "${this.controlPassword}"\r\n`);
          }
          // Check for errors
          else if (response.includes('5')) {
            client.end();
            reject(new Error(`Tor control error: ${response}`));
          }
        });
        
        client.on('error', (error) => {
          logger.error('Error connecting to Tor control port', { error: error.message });
          reject(error);
        });
        
        client.on('close', () => {
          if (!dataBuffer.includes('250-ServiceID=')) {
            reject(new Error('Failed to create hidden service'));
          }
        });
      });
    } catch (error) {
      logger.error('Failed to create hidden service via Tor control', { error: error.message });
      throw new Error(`Tor control communication failed: ${error.message}`);
    }
  }

  /**
   * Start periodic status checks for the Tor hidden service
   * This ensures we know if the service becomes unavailable
   */
  startStatusChecks() {
    // Clear any existing interval
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
    }
    
    // Set up status checks every 5 minutes
    const checkIntervalMs = 5 * 60 * 1000;
    this.statusCheckInterval = setInterval(() => {
      this.checkServiceStatus().catch(error => {
        logger.error('Tor service status check failed', { error: error.message });
      });
    }, checkIntervalMs);
    
    // Run an initial check
    this.checkServiceStatus().catch(error => {
      logger.error('Initial Tor service status check failed', { error: error.message });
    });
  }

  /**
   * Check the status of the Tor hidden service
   * This verifies that the service is accessible and functional
   */
  async checkServiceStatus() {
    try {
      // First check if Tor is running
      await this.checkTorAvailability();
      
      // If we don't have an onion address, we can't check the service
      if (!this.onionAddress) {
        logger.warn('Cannot check Tor service status: No onion address configured');
        return false;
      }
      
      // Check if the hidden service is accessible
      // This is challenging to do directly, so we'll check the Tor process
      // and the existence of the service directory as a proxy
      
      if (this.serviceDirectory) {
        try {
          await fs.access(this.serviceDirectory);
          // Directory exists, check for the hostname file
          const hostname = await fs.readFile(
            path.join(this.serviceDirectory, 'hostname'), 
            'utf8'
          );
          
          if (hostname.trim() !== this.onionAddress) {
            logger.warn('Onion address mismatch', {
              expected: this.onionAddress,
              actual: hostname.trim()
            });
          }
        } catch (error) {
          logger.error('Tor service directory not accessible', {
            directory: this.serviceDirectory,
            error: error.message
          });
          return false;
        }
      }
      
      // Update status and last check time
      this.lastCheck = new Date();
      logger.info('Tor hidden service check passed', { onionAddress: this.onionAddress });
      return true;
    } catch (error) {
      logger.error('Tor hidden service check failed', { error: error.message });
      return false;
    }
  }

  /**
   * Get the status of the Tor service
   * @returns {Object} Status information for the Tor service
   */
  getServiceStatus() {
    return {
      enabled: this.enabled,
      running: this.isRunning,
      onionAddress: this.onionAddress,
      lastCheck: this.lastCheck,
      autoConfig: this.autoConfig,
      serviceDirectory: this.serviceDirectory
    };
  }

  /**
   * Get the .onion URL for accessing the CivIQ platform via Tor
   * @returns {String} The full .onion URL
   */
  getOnionUrl() {
    if (!this.onionAddress) {
      return null;
    }
    
    return `http://${this.onionAddress}`;
  }

  /**
   * Check if a given string is a valid .onion address
   * @param {String} address - The address to validate
   * @returns {Boolean} Whether the address is valid
   */
  isValidOnionAddress(address) {
    // V2 onion addresses are 16 chars + .onion (22 total)
    // V3 onion addresses are 56 chars + .onion (62 total)
    const onionRegex = /^([a-z2-7]{16}|[a-z2-7]{56})\.onion$/;
    return onionRegex.test(address);
  }

  /**
   * Test connectivity to the Tor hidden service
   * This attempts to connect to the service via the Tor network
   */
  async testConnectivity() {
    try {
      if (!this.onionAddress) {
        throw new Error('No onion address configured');
      }
      
      // We'll use the torsocks command to route a curl request through Tor
      const onionUrl = this.getOnionUrl();
      const command = `torsocks curl -sL --max-time 30 -o /dev/null -w "%{http_code}" ${onionUrl}`;
      
      const { stdout, stderr } = await execAsync(command);
      const statusCode = parseInt(stdout.trim(), 10);
      
      if (statusCode >= 200 && statusCode < 500) {
        // Any status code that's not a server error is good
        // (even 404 means the onion service is working)
        logger.info('Successfully connected to Tor hidden service', {
          onionAddress: this.onionAddress,
          statusCode
        });
        return {
          accessible: true,
          statusCode,
          message: 'Tor hidden service is accessible'
        };
      } else {
        logger.warn('Connected to Tor hidden service but received error status', {
          onionAddress: this.onionAddress,
          statusCode
        });
        return {
          accessible: false,
          statusCode,
          message: `Received error status ${statusCode}`
        };
      }
    } catch (error) {
      logger.error('Failed to connect to Tor hidden service', {
        onionAddress: this.onionAddress,
        error: error.message
      });
      return {
        accessible: false,
        error: error.message,
        message: 'Failed to connect to Tor hidden service'
      };
    }
  }
}

// Create a singleton instance
const torService = new TorService();

module.exports = torService;