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
 * Shared constants used throughout the application
 */

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY_IDENTITY: '/auth/verify-identity',
  },
  
  // User profile endpoints
  PROFILES: {
    GET: '/profiles/:userId',
    UPDATE: '/profiles/update',
    REPUTATION: '/profiles/:userId/reputation',
  },
  
  // Content endpoints
  CONTENT: {
    POSTS: '/content/posts',
    POST_DETAIL: '/content/posts/:postId',
    COMMENTS: '/content/posts/:postId/comments',
    COMMENT_DETAIL: '/content/comments/:commentId',
    VOTE: '/content/vote',
  },
  
  // Moderation endpoints
  MODERATION: {
    CHECK_CONTENT: '/moderation/check-content',
    REPORT: '/moderation/report',
    QUEUE: '/moderation/queue',
    ACTION: '/moderation/action',
  },
};

// User reputation thresholds
export const REPUTATION = {
  NEW_USER: 0,
  BASIC: 50,
  TRUSTED: 200,
  ESTABLISHED: 500,
  EXEMPLARY: 1000,
};

// Content ranking factors
export const RANKING_FACTORS = {
  UPVOTE_WEIGHT: 1,
  DOWNVOTE_WEIGHT: -1,
  REPUTATION_MULTIPLIER: 0.5,
  RECENCY_DECAY: 0.8, // per day
};

// Rate limiting configuration
export const RATE_LIMITS = {
  POST: {
    TIME_WINDOW: 300, // 5 minutes
    MAX_REQUESTS: 1,
  },
  COMMENT: {
    TIME_WINDOW: 30, // 30 seconds
    MAX_REQUESTS: 3,
  },
  VOTE: {
    TIME_WINDOW: 5, // 5 seconds
    MAX_REQUESTS: 5,
  },
};