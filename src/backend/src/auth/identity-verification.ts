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
import { createHash } from 'crypto';

// Configure Redis client
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

/**
 * Validates a fingerprint against known users to prevent multiple accounts
 * @param fingerprint The browser fingerprint from FingerprintJS
 * @param userId The user's ID
 * @returns An object indicating if the fingerprint is valid and any conflicts
 */
export async function validateFingerprint(fingerprint: string, userId: string) {
  const fingerprintHash = createHash('sha256').update(fingerprint).digest('hex');
  
  // Check if this fingerprint exists and is associated with a different user
  const existingUserId = await redisClient.get(`fingerprint:${fingerprintHash}`);
  
  if (existingUserId && existingUserId !== userId) {
    // Found a potential multiple account
    return {
      valid: false,
      conflict: true,
      existingUserId,
    };
  }
  
  // Store the association between fingerprint and user
  await redisClient.set(`fingerprint:${fingerprintHash}`, userId);
  
  return {
    valid: true,
    conflict: false,
  };
}

/**
 * Validates email reputation to prevent spam accounts
 * @param email The email to check
 * @returns A validation result object
 */
export async function validateEmailReputation(email: string) {
  if (!process.env.KICKBOX_API_KEY) {
    console.warn('Kickbox API key not configured, skipping email validation');
    return { valid: true, score: 1.0 };
  }
  
  try {
    const response = await fetch(`https://api.kickbox.com/v2/verify?email=${encodeURIComponent(email)}&apikey=${process.env.KICKBOX_API_KEY}`);
    const data = await response.json();
    
    // Check if the email is disposable or has low deliverability
    if (data.disposable || data.result === 'undeliverable') {
      return {
        valid: false,
        score: data.sendex || 0,
        reason: data.reason || 'Invalid email',
      };
    }
    
    return {
      valid: true,
      score: data.sendex || 0.5,
    };
  } catch (error) {
    console.error('Error validating email:', error);
    // Default to allowing the email if the service is unavailable
    return { valid: true, score: 0.5 };
  }
}

/**
 * Tracks IP address usage to rate limit signups
 * @param ipAddress The user's IP address
 * @returns True if the IP is allowed, false if rate limited
 */
export async function checkIpRateLimit(ipAddress: string): Promise<boolean> {
  const key = `ip:signup:${ipAddress}`;
  const count = await redisClient.incr(key);
  
  // First time seeing this IP, set expiration
  if (count === 1) {
    await redisClient.expire(key, 24 * 60 * 60); // 24 hours
  }
  
  // Limit to 5 accounts per day from the same IP
  return count <= 5;
}

/**
 * Full identity verification check
 * @param data User data including email, fingerprint, and IP
 * @returns Verification result
 */
export async function verifyIdentity(data: {
  email: string;
  fingerprint: string;
  ipAddress: string;
  userId: string;
}) {
  const { email, fingerprint, ipAddress, userId } = data;
  
  // Check email reputation
  const emailCheck = await validateEmailReputation(email);
  if (!emailCheck.valid) {
    return {
      success: false,
      reason: 'Email rejected due to reputation check',
      details: emailCheck,
    };
  }
  
  // Check fingerprint for multiple accounts
  const fingerprintCheck = await validateFingerprint(fingerprint, userId);
  if (!fingerprintCheck.valid) {
    return {
      success: false,
      reason: 'Fingerprint linked to existing account',
      details: fingerprintCheck,
    };
  }
  
  // Check IP rate limiting
  const ipAllowed = await checkIpRateLimit(ipAddress);
  if (!ipAllowed) {
    return {
      success: false,
      reason: 'Too many accounts created from this IP address',
    };
  }
  
  return {
    success: true,
  };
}