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
 * CivilityScoreService.js
 * 
 * This service manages CivIQ's civility scoring system, which measures and
 * rewards constructive user participation while penalizing toxic behavior.
 * The civility score directly influences content visibility and moderation
 * weight, creating a self-reinforcing system of quality discourse.
 * 
 * The service provides methods for calculating, adjusting, and evaluating
 * civility scores based on user actions and content interactions.
 */

const { logger } = require('../../../utils/logger');
const config = require('../../../../../config/moderation.config');
const { BadRequestError } = require('../../../utils/errors');

// Constants for score calculation
const SCORE_DEFAULTS = {
  INITIAL_SCORE: 0.5,       // New users start at 50% (neutral)
  MIN_SCORE: 0.0,           // Minimum possible score
  MAX_SCORE: 1.0,           // Maximum possible score
  HISTORY_WEIGHT: 0.8,      // How much past history influences new calculations
  RECOVERY_RATE: 0.005,     // Daily passive recovery rate for negative actions
  SCORE_DECAY_RATE: 0.001   // Daily decay for inactive users
};

// Action impact weights
const ACTION_WEIGHTS = {
  // Positive actions
  QUALITY_POST: 0.02,           // Creating high-quality content
  CONSTRUCTIVE_COMMENT: 0.01,   // Constructive comment
  QUALITY_SOURCE: 0.015,        // Using reliable sources
  HELPFUL_FLAG: 0.005,          // Flagging content that is legitimately problematic
  VERIFICATION: 0.03,           // Completing additional verification steps
  
  // Negative actions
  TOXIC_COMMENT: -0.03,         // Harmful, non-constructive comment
  FALSE_INFORMATION: -0.025,    // Spreading verifiably false information
  HARASSMENT: -0.05,            // Personal attacks or harassment
  SPAM: -0.02,                  // Spam content
  FALSE_FLAG: -0.01,            // Repeatedly flagging content inappropriately
  RULE_VIOLATION: -0.035        // General rule violation
};

class CivilityScoreService {
  constructor() {
    // Load configuration
    this.config = config.civilityScore || {};
    
    // Merge default constants with config
    this.scoreParams = {
      ...SCORE_DEFAULTS,
      ...(this.config.scoreParams || {})
    };
    
    // Merge default action weights with config
    this.actionWeights = {
      ...ACTION_WEIGHTS,
      ...(this.config.actionWeights || {})
    };
    
    // Weight multipliers based on user tier
    this.userTierMultipliers = this.config.userTierMultipliers || {
      newUser: 1.0,
      regular: 1.0,
      trusted: 0.9,  // Trusted users get slightly less penalty
      expert: 0.8    // Experts get even less penalty for mistakes
    };
    
    // Thresholds for different score tiers
    this.scoreTiers = this.config.scoreTiers || {
      veryLow: 0.2,
      low: 0.35,
      neutral: 0.5,
      good: 0.7,
      excellent: 0.85
    };
    
    logger.info('Civility score service initialized');
  }

  /**
   * Calculate the initial civility score for a new user
   * @param {Object} userData - User data including verification level
   * @returns {Number} - The initial civility score
   */
  calculateInitialScore(userData = {}) {
    let score = this.scoreParams.INITIAL_SCORE;
    
    // Adjust based on verification level
    if (userData.verificationLevel) {
      const verificationBonus = {
        basic: 0.0,     // No bonus for basic verification
        standard: 0.05, // Slight bonus for standard verification
        enhanced: 0.1   // Larger bonus for enhanced verification
      };
      
      score += verificationBonus[userData.verificationLevel] || 0;
    }
    
    // Cap score within valid range
    return this.capScore(score);
  }

  /**
   * Get the current civility score for a user
   * @param {String} userId - User ID
   * @returns {Promise<Object>} - Civility score data
   */
  async getUserScore(userId) {
    try {
      // Placeholder for database query to get user score
      // In a real implementation, this would query the database
      // Instead, we'll simulate a score retrieval
      
      // Mock implementation - replace with actual DB query
      const mockUserScores = {
        'user-123': {
          score: 0.75,
          lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          actionHistory: [
            { action: 'QUALITY_POST', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
            { action: 'CONSTRUCTIVE_COMMENT', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) }
          ]
        },
        'user-456': {
          score: 0.35,
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          actionHistory: [
            { action: 'TOXIC_COMMENT', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
          ]
        }
      };
      
      // Get user score from mock data or use default
      const userData = mockUserScores[userId] || {
        score: this.scoreParams.INITIAL_SCORE,
        lastUpdated: new Date(),
        actionHistory: []
      };
      
      // Apply time-based adjustments (recovery and decay)
      const adjustedScore = this.applyTimeBasedAdjustments(userData);
      
      // Return score with tier information
      const tier = this.getScoreTier(adjustedScore);
      
      return {
        userId,
        score: adjustedScore,
        tier,
        lastUpdated: new Date(),
        history: userData.actionHistory
      };
    } catch (error) {
      logger.error('Failed to get user civility score', { userId, error: error.message });
      throw error;
    }
  }

  /**
   * Apply time-based adjustments to a user's score
   * Includes score recovery for negative actions and decay for inactivity
   * @param {Object} userData - User data including score and last update time
   * @returns {Number} - Adjusted score
   */
  applyTimeBasedAdjustments(userData) {
    const currentScore = userData.score;
    const lastUpdated = userData.lastUpdated;
    
    // Calculate days since last update
    const daysSinceUpdate = (new Date() - lastUpdated) / (1000 * 60 * 60 * 24);
    
    if (daysSinceUpdate < 1) {
      // Less than a day, no adjustments needed
      return currentScore;
    }
    
    let adjustedScore = currentScore;
    
    // Apply recovery for users below neutral
    if (currentScore < this.scoreTiers.neutral) {
      // Apply recovery based on days passed
      const recoveryAmount = this.scoreParams.RECOVERY_RATE * daysSinceUpdate;
      adjustedScore += recoveryAmount;
    } 
    // Apply decay for users above neutral who haven't been active
    else if (currentScore > this.scoreTiers.neutral) {
      // Apply decay based on days passed
      const decayAmount = this.scoreParams.SCORE_DECAY_RATE * daysSinceUpdate;
      adjustedScore -= decayAmount;
    }
    
    // Ensure score stays within bounds
    return this.capScore(adjustedScore);
  }

  /**
   * Adjust a user's civility score based on an action
   * @param {String} userId - User ID
   * @param {String} action - Action type (must match a key in ACTION_WEIGHTS)
   * @param {Object} context - Additional context for the score adjustment
   * @returns {Promise<Object>} - Updated score information
   */
  async adjustScore(userId, action, context = {}) {
    try {
      // Validate the action
      if (!this.actionWeights[action]) {
        throw new BadRequestError(`Invalid action type: ${action}`);
      }
      
      // Get current user score
      const currentScoreData = await this.getUserScore(userId);
      const currentScore = currentScoreData.score;
      
      // Get weight for this action
      let weight = this.actionWeights[action];
      
      // Apply user tier multiplier for negative actions
      if (weight < 0 && context.userTier) {
        const multiplier = this.userTierMultipliers[context.userTier] || 1.0;
        weight *= multiplier;
      }
      
      // Apply content impact multiplier if provided
      if (context.impact) {
        weight *= context.impact;
      }
      
      // Calculate new score with historical weighting
      const rawNewScore = (currentScore * this.scoreParams.HISTORY_WEIGHT) + 
                         (weight * (1 - this.scoreParams.HISTORY_WEIGHT));
      
      // Cap the score within valid range
      const newScore = this.capScore(rawNewScore);
      
      // Record action in history
      const actionRecord = {
        action,
        timestamp: new Date(),
        change: newScore - currentScore,
        context: {
          contentId: context.contentId,
          reason: context.reason
        }
      };
      
      // Update user score in database (mock implementation)
      // In a real implementation, this would update the database
      logger.info('Adjusted user civility score', {
        userId,
        action,
        oldScore: currentScore,
        newScore: newScore,
        change: newScore - currentScore
      });
      
      // Return updated score information
      return {
        userId,
        oldScore: currentScore,
        newScore,
        change: newScore - currentScore,
        oldTier: this.getScoreTier(currentScore),
        newTier: this.getScoreTier(newScore),
        action: actionRecord
      };
    } catch (error) {
      logger.error('Failed to adjust user civility score', {
        userId,
        action,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Calculate the civility impact of content based on its characteristics
   * @param {Object} contentData - Content characteristics
   * @returns {Number} - Impact score multiplier
   */
  calculateContentImpact(contentData) {
    let impact = 1.0; // Default impact
    
    // Adjust based on content visibility
    if (contentData.visibility) {
      const visibilityMultipliers = {
        high: 1.5,    // Highly visible content has more impact
        medium: 1.0,  // Normal visibility
        low: 0.7      // Low visibility content has less impact
      };
      
      impact *= visibilityMultipliers[contentData.visibility] || 1.0;
    }
    
    // Adjust based on content type
    if (contentData.type) {
      const typeMultipliers = {
        post: 1.2,      // Original posts have higher impact
        comment: 1.0,   // Comments have normal impact
        reply: 0.8      // Deep replies have less impact
      };
      
      impact *= typeMultipliers[contentData.type] || 1.0;
    }
    
    // Adjust based on community sensitivity
    if (contentData.communitySensitivity) {
      const sensitivityMultipliers = {
        high: 1.3,    // Sensitive communities have stricter standards
        medium: 1.0,  // Normal communities
        low: 0.9      // Less sensitive communities
      };
      
      impact *= sensitivityMultipliers[contentData.communitySensitivity] || 1.0;
    }
    
    return impact;
  }

  /**
   * Get the tier description for a given score
   * @param {Number} score - Civility score
   * @returns {String} - Score tier description
   */
  getScoreTier(score) {
    if (score < this.scoreTiers.veryLow) {
      return 'restricted';
    } else if (score < this.scoreTiers.low) {
      return 'probation';
    } else if (score < this.scoreTiers.neutral) {
      return 'limited';
    } else if (score < this.scoreTiers.good) {
      return 'standard';
    } else if (score < this.scoreTiers.excellent) {
      return 'trusted';
    } else {
      return 'exemplary';
    }
  }

  /**
   * Cap a score to ensure it stays within the valid range
   * @param {Number} score - Score to cap
   * @returns {Number} - Capped score
   */
  capScore(score) {
    return Math.max(
      this.scoreParams.MIN_SCORE,
      Math.min(score, this.scoreParams.MAX_SCORE)
    );
  }

  /**
   * Get moderation weight for a user based on their civility score
   * @param {String} userId - User ID
   * @returns {Promise<Number>} - Moderation weight (0-1)
   */
  async getModerationWeight(userId) {
    try {
      const { score } = await this.getUserScore(userId);
      
      // Calculate moderation weight - higher scores have more moderation influence
      // We use a non-linear curve to reward high scores more significantly
      const weight = Math.pow(score, 1.5);
      
      return this.capScore(weight);
    } catch (error) {
      logger.error('Failed to get user moderation weight', {
        userId,
        error: error.message
      });
      
      // Return neutral weight in case of error
      return 0.5;
    }
  }

  /**
   * Get content visibility multiplier based on user's civility score
   * @param {String} userId - User ID
   * @returns {Promise<Number>} - Visibility multiplier
   */
  async getVisibilityMultiplier(userId) {
    try {
      const { score } = await this.getUserScore(userId);
      
      // Calculate visibility multiplier
      // Low scores get reduced visibility, high scores get boosted visibility
      let multiplier;
      
      if (score < this.scoreTiers.low) {
        // Significant reduction for very low scores
        multiplier = 0.3;
      } else if (score < this.scoreTiers.neutral) {
        // Moderate reduction for below average scores
        multiplier = 0.7;
      } else if (score < this.scoreTiers.good) {
        // Neutral for average scores
        multiplier = 1.0;
      } else if (score < this.scoreTiers.excellent) {
        // Boost for good scores
        multiplier = 1.2;
      } else {
        // Significant boost for excellent scores
        multiplier = 1.4;
      }
      
      return multiplier;
    } catch (error) {
      logger.error('Failed to get user visibility multiplier', {
        userId,
        error: error.message
      });
      
      // Return neutral multiplier in case of error
      return 1.0;
    }
  }

  /**
   * Get score restoration requirements for users with low scores
   * @param {String} userId - User ID
   * @returns {Promise<Object>} - Restoration requirements
   */
  async getRestorationRequirements(userId) {
    try {
      const { score, tier } = await this.getUserScore(userId);
      
      // Only generate requirements for users with below neutral scores
      if (score >= this.scoreTiers.neutral) {
        return {
          userId,
          requiresRestoration: false,
          currentTier: tier,
          currentScore: score
        };
      }
      
      // Calculate requirements based on how far below neutral they are
      const deficit = this.scoreTiers.neutral - score;
      
      // Calculate positive actions needed to return to neutral
      // We use a combination of different positive actions
      const positiveActionsNeeded = {
        constructiveComments: Math.ceil(deficit / this.actionWeights.CONSTRUCTIVE_COMMENT),
        qualityPosts: Math.ceil(deficit / this.actionWeights.QUALITY_POST),
        // Time to recover naturally (in days)
        timeToNaturalRecovery: Math.ceil(deficit / this.scoreParams.RECOVERY_RATE)
      };
      
      return {
        userId,
        requiresRestoration: true,
        currentTier: tier,
        currentScore: score,
        targetScore: this.scoreTiers.neutral,
        deficit,
        positiveActionsNeeded,
        // Restrictions based on tier
        restrictions: this.getRestrictionsByTier(tier)
      };
    } catch (error) {
      logger.error('Failed to get user restoration requirements', {
        userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get restrictions for a user based on their score tier
   * @param {String} tier - Score tier
   * @returns {Object} - Restrictions for the tier
   */
  getRestrictionsByTier(tier) {
    const restrictions = {
      restricted: {
        canPost: false,
        canComment: false,
        canVote: false,
        canFlag: false,
        requiresApproval: true,
        visibilityReduction: 0.1 // 90% reduction
      },
      probation: {
        canPost: false,
        canComment: true,
        canVote: false,
        canFlag: false,
        requiresApproval: true,
        visibilityReduction: 0.3 // 70% reduction
      },
      limited: {
        canPost: true,
        canComment: true,
        canVote: true,
        canFlag: false,
        requiresApproval: false,
        visibilityReduction: 0.7 // 30% reduction
      },
      standard: {
        canPost: true,
        canComment: true,
        canVote: true,
        canFlag: true,
        requiresApproval: false,
        visibilityReduction: 1.0 // No reduction
      },
      trusted: {
        canPost: true,
        canComment: true,
        canVote: true,
        canFlag: true,
        requiresApproval: false,
        visibilityReduction: 1.2 // 20% boost
      },
      exemplary: {
        canPost: true,
        canComment: true,
        canVote: true,
        canFlag: true,
        requiresApproval: false,
        visibilityReduction: 1.4 // 40% boost
      }
    };
    
    return restrictions[tier] || restrictions.standard;
  }
}

// Create a singleton instance
const civilityScoreService = new CivilityScoreService();

module.exports = civilityScoreService;