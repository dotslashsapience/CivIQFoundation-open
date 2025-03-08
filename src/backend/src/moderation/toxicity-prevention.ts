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

import Redis from 'redis';

// Configure Redis client for rate limiting
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis Error:', err);
});

// Connect to Redis
(async () => {
  await redisClient.connect();
})();

// Patterns that indicate potentially toxic content
const toxicPatterns = [
  // Personal attacks
  /\b(idiot|stupid|dumb|moron|retard|loser)\b/i,
  
  // Hate speech (simplified example, real implementation would be more robust)
  /\b(n[i!1]gg[e3]r|f[a@]gg[o0]t|k[i!1]k[e3]|sp[i!1]c|ch[i!1]nk)\b/i,
  
  // Threatening language
  /\b(kill|hurt|attack|punch|murder) you\b/i,
  
  // Excessive profanity in context
  /\b(f[u*]ck|sh[i*]t).{0,20}\b(f[u*]ck|sh[i*]t)\b.{0,20}\b(f[u*]ck|sh[i*]t)\b/i,
];

/**
 * Check if content contains toxic language using pattern matching
 * @param content The content to check
 * @returns Object indicating if content is toxic and why
 */
export function checkToxicContent(content: string) {
  // Context-aware toxicity detection
  for (const pattern of toxicPatterns) {
    if (pattern.test(content)) {
      return {
        isToxic: true,
        reason: 'Content contains prohibited language',
        pattern: pattern.toString(),
      };
    }
  }
  
  return {
    isToxic: false,
  };
}

/**
 * Rate limit user actions to prevent spam and brigading
 * @param userId The user's ID
 * @param actionType The type of action (post, comment, etc.)
 * @returns Whether the action is allowed or rate-limited
 */
export async function checkUserRateLimit(userId: string, actionType: string): Promise<boolean> {
  const key = `rate:${userId}:${actionType}`;
  const count = await redisClient.incr(key);
  
  // Set expiration on first action
  if (count === 1) {
    // Different limits for different actions
    let expiration = 60; // Default 1 minute
    
    switch (actionType) {
      case 'post':
        expiration = 5 * 60; // 5 minutes between posts
        break;
      case 'comment':
        expiration = 30; // 30 seconds between comments
        break;
      case 'vote':
        expiration = 5; // 5 seconds between votes
        break;
    }
    
    await redisClient.expire(key, expiration);
  }
  
  // Different thresholds for different actions
  let threshold = 1; // Default threshold
  
  switch (actionType) {
    case 'post':
      threshold = 1; // 1 post per 5 minutes
      break;
    case 'comment':
      threshold = 3; // 3 comments per 30 seconds
      break;
    case 'vote':
      threshold = 5; // 5 votes per 5 seconds
      break;
  }
  
  return count <= threshold;
}

/**
 * Check if a user is attempting to brigade (mass downvote or attack)
 * @param userId The user's ID
 * @param targetId The target post or user being acted upon
 * @param actionType The type of action
 * @returns Whether the action is allowed or considered brigading
 */
export async function checkBrigading(userId: string, targetId: string, actionType: string): Promise<boolean> {
  // Track actions by this user against this target
  const key = `brigade:${userId}:${targetId}:${actionType}`;
  const count = await redisClient.incr(key);
  
  // Set expiration on first action
  if (count === 1) {
    await redisClient.expire(key, 24 * 60 * 60); // 24 hours
  }
  
  // Thresholds for brigading detection
  let threshold = 5; // Default threshold
  
  switch (actionType) {
    case 'downvote':
      threshold = 5; // Downvoting 5+ comments from same user/post is suspicious
      break;
    case 'report':
      threshold = 3; // Reporting 3+ comments from same user is suspicious
      break;
    case 'reply':
      threshold = 10; // 10+ rapid replies to same user could be harassment
      break;
  }
  
  return count <= threshold;
}

/**
 * Full moderation check for user content
 * @param data Content data and user information
 * @returns Moderation result
 */
export async function moderateContent(data: {
  content: string;
  userId: string;
  actionType: string;
  targetId?: string;
}): Promise<{
  allowed: boolean;
  reason?: string;
}> {
  const { content, userId, actionType, targetId } = data;
  
  // Check for toxic content
  const toxicCheck = checkToxicContent(content);
  if (toxicCheck.isToxic) {
    return {
      allowed: false,
      reason: toxicCheck.reason,
    };
  }
  
  // Check rate limiting
  const withinRateLimit = await checkUserRateLimit(userId, actionType);
  if (!withinRateLimit) {
    return {
      allowed: false,
      reason: `You're doing that too often. Please wait before ${actionType === 'post' ? 'posting' : actionType === 'comment' ? 'commenting' : 'taking this action'} again.`,
    };
  }
  
  // Check for brigading if there's a target
  if (targetId) {
    const notBrigading = await checkBrigading(userId, targetId, actionType);
    if (!notBrigading) {
      return {
        allowed: false,
        reason: 'This action has been blocked to prevent targeted harassment.',
      };
    }
  }
  
  return {
    allowed: true,
  };
}