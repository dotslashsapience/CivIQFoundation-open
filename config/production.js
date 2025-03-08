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
 * Production environment configuration
 * Overrides default configuration with production-specific values
 */
module.exports = {
  // Production-optimized logging
  logging: {
    level: 'info',
    prettyPrint: false,
  },
  
  // Ensure JWT secret is set in production
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    passwordRounds: 12, // Stronger password hashing in production
  },
  
  // Database pool configuration for production
  database: {
    pool: {
      min: 5,
      max: 20,
    },
  },
  
  // Enhanced security settings for production
  security: {
    cors: {
      origin: process.env.FRONTEND_URL || 'https://civiq.us',
      credentials: true,
    },
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "*.cloudfront.net"],
          connectSrc: ["'self'", "wss://*.civiq.us"],
          fontSrc: ["'self'", "data:"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
    },
  },
};