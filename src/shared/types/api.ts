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
 * API interface types shared between frontend and backend
 * These define the structure of requests and responses
 */

// Auth types
export interface RegisterRequest {
  email: string;
  password: string;
  fingerprint: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  fingerprint: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: UserProfile;
}

export interface VerifyIdentityRequest {
  userId: string;
  fingerprint: string;
}

export interface VerifyIdentityResponse {
  success: boolean;
  reason?: string;
  details?: any;
}

// User profile types
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  reputation: number;
  createdAt: string;
  isVerified: boolean;
  bio?: string;
  avatarUrl?: string;
}

export interface UpdateProfileRequest {
  userId: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  profile?: UserProfile;
}

// Content types
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: UserProfile;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  tags: string[];
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author: UserProfile;
  postId: string;
  parentId?: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  authorId: string;
  tags?: string[];
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  post?: Post;
}

export interface CreateCommentRequest {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}

export interface CreateCommentResponse {
  success: boolean;
  message: string;
  comment?: Comment;
}

// Moderation types
export interface ModerateContentRequest {
  content: string;
  userId: string;
  actionType: 'post' | 'comment' | 'vote' | 'report';
  targetId?: string;
}

export interface ModerateContentResponse {
  allowed: boolean;
  reason?: string;
}

export interface ReportContentRequest {
  contentId: string;
  reporterId: string;
  reason: string;
  details?: string;
}

export interface ReportContentResponse {
  success: boolean;
  message: string;
}

export interface ModerationAction {
  contentId: string;
  action: 'approve' | 'remove' | 'warn';
  moderatorId: string;
  reason?: string;
}

export interface ModerationActionResponse {
  success: boolean;
  message: string;
}