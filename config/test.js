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
 * Test environment configuration
 * Overrides default configuration with test-specific values
 */
module.exports = {
  // Use test database
  database: {
    url: process.env.TEST_DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/civiq_test',
    pool: {
      min: 1,
      max: 5,
    },
  },
  
  // Use test redis instance
  redis: {
    url: process.env.TEST_REDIS_URL || 'redis://localhost:6379/1',
  },
  
  // Disable external API calls in tests
  apis: {
    kickbox: {
      enabled: false,
    },
  },
  
  // Minimal logging during tests
  logging: {
    level: 'error',
    prettyPrint: false,
  },
  
  // Faster password hashing for tests
  auth: {
    jwtSecret: 'test_secret_key',
    passwordRounds: 1,
  },
};