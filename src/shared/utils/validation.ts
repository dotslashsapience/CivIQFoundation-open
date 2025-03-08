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

import { z } from 'zod';

/**
 * Shared validation schemas for API requests and responses
 * Used by both frontend and backend to ensure data integrity
 */

// Auth validation schemas
export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fingerprint: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string(),
  fingerprint: z.string(),
});

export const verifyIdentitySchema = z.object({
  userId: z.string(),
  fingerprint: z.string(),
});

// User profile validation schemas
export const updateProfileSchema = z.object({
  userId: z.string(),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  avatarUrl: z.string().url('Invalid URL').optional(),
});

// Content validation schemas
export const createPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  authorId: z.string(),
  tags: z.array(z.string()).optional(),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(5000, 'Comment must be less than 5000 characters'),
  authorId: z.string(),
  postId: z.string(),
  parentId: z.string().optional(),
});

// Moderation validation schemas
export const moderateContentSchema = z.object({
  content: z.string(),
  userId: z.string(),
  actionType: z.enum(['post', 'comment', 'vote', 'report']),
  targetId: z.string().optional(),
});

export const reportContentSchema = z.object({
  contentId: z.string(),
  reporterId: z.string(),
  reason: z.string().min(1, 'Reason is required'),
  details: z.string().optional(),
});

export const moderationActionSchema = z.object({
  contentId: z.string(),
  action: z.enum(['approve', 'remove', 'warn']),
  moderatorId: z.string(),
  reason: z.string().optional(),
});