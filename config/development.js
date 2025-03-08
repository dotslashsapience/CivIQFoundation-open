/**
 * CivIQ - A civic discourse platform
 * Copyright (c) 2025 CivIQ Foundation
 * 
 * This software is licensed under the CivIQ Ethical Licensing Agreement,
 * based on the Hippocratic License with additional provisions.
 * See LICENSE.md and TERMS_OF_USE.md for full details.
 * 
 * By using this software, you agree to uphold CivIQ's mission of fostering
 * meaningful, evidence-based discussions and combating misinformation.
 */

/**
 * Development environment configuration
 * Overrides default configuration with development-specific values
 */
module.exports = {
  server: {
    // Override to use a development-specific port if needed
    // port: 8001,
  },
  
  // Enable additional logging for development
  logging: {
    level: 'debug',
    prettyPrint: true,
  },
  
  // Relaxed rate limiting for development
  moderation: {
    rateLimit: {
      post: {
        timeWindow: 10, // 10 seconds in development
        maxRequests: 10,
      },
      comment: {
        timeWindow: 5, // 5 seconds
        maxRequests: 10,
      },
      vote: {
        timeWindow: 1, // 1 second
        maxRequests: 10,
      },
    },
  },
  
  // Simplified auth for development
  auth: {
    jwtExpiresIn: '30d', // Longer expiration for development
  },
};