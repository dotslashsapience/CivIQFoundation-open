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
 * Default configuration for the CivIQ platform
 * These values can be overridden by environment-specific config files
 */
module.exports = {
  server: {
    port: process.env.PORT || 8000,
    host: '0.0.0.0',
  },
  
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/civiq',
    pool: {
      min: 2,
      max: 10,
    },
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'development_secret_key_change_in_production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    passwordRounds: 10,
  },
  
  apis: {
    kickbox: {
      apiKey: process.env.KICKBOX_API_KEY || '',
      enabled: !!process.env.KICKBOX_API_KEY,
    },
    weaviate: {
      url: process.env.WEAVIATE_URL || 'http://localhost:8080',
    },
  },
  
  moderation: {
    toxicityThreshold: 0.8,
    rateLimit: {
      post: {
        timeWindow: 5 * 60, // 5 minutes
        maxRequests: 1,
      },
      comment: {
        timeWindow: 30, // 30 seconds
        maxRequests: 3,
      },
      vote: {
        timeWindow: 5, // 5 seconds
        maxRequests: 5,
      },
    },
  },
  
  content: {
    ranking: {
      recencyWeight: 0.5,
      scoreWeight: 0.3,
      reputationWeight: 0.2,
      decayFactor: 0.8, // per day
    },
  },
  
  reputation: {
    thresholds: {
      newUser: 0,
      basic: 50,
      trusted: 200,
      established: 500,
      exemplary: 1000,
    },
    actions: {
      postUpvote: 10,
      postDownvote: -2,
      commentUpvote: 5,
      commentDownvote: -1,
      postCreated: 3,
      commentCreated: 1,
    },
  },
};