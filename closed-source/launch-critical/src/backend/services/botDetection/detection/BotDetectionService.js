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
 * BotDetectionService.js
 * 
 * This service provides core functionality for detecting and preventing automated
 * accounts and coordinated inauthentic behavior on the CivIQ platform. It implements
 * a multi-layered approach to ensure human-to-human interactions while minimizing
 * false positives.
 * 
 * The service coordinates various detection techniques and maintains a risk-based
 * approach to verification challenges.
 */

const { logger } = require('../../../utils/logger');
const config = require('../../../../../config/botDetection.config');
const BehaviorAnalyzer = require('../behaviorAnalysis/BehaviorAnalyzer');
const VerificationChallenge = require('../verification/VerificationChallenge');
const BrigadingDetector = require('../brigading/BrigadingDetector');

class BotDetectionService {
  constructor() {
    // Initialize with configuration
    this.config = config || {};
    
    // Detection thresholds
    this.THRESHOLDS = {
      LOW_RISK: 0.3,
      MEDIUM_RISK: 0.6,
      HIGH_RISK: 0.8,
      CRITICAL_RISK: 0.95
    };
    
    // Initialize sub-services
    this.behaviorAnalyzer = new BehaviorAnalyzer();
    this.verificationChallenge = new VerificationChallenge();
    this.brigadingDetector = new BrigadingDetector();
    
    // Detection counters for metrics
    this.detectionStats = {
      totalAnalyzed: 0,
      botDetections: 0,
      falsePositives: 0,
      challengesIssued: 0,
      challengesPassed: 0,
      challengesFailed: 0
    };
    
    logger.info('Bot detection service initialized');
  }

  /**
   * Analyze user activity for bot-like behavior
   * 
   * @param {String} userId - User ID to analyze
   * @param {Object} activityData - Activity data to analyze
   * @returns {Promise<Object>} - Risk assessment results
   */
  async analyzeActivity(userId, activityData) {
    try {
      // Increment analysis counter
      this.detectionStats.totalAnalyzed++;
      
      // Start with base risk assessment
      const riskAssessment = {
        userId,
        timestamp: new Date().toISOString(),
        riskLevel: 0,
        primarySignals: [],
        detailedFactors: {},
        recommendedAction: 'none'
      };
      
      // Analyze behavior patterns
      const behaviorRisk = await this.behaviorAnalyzer.analyzeUserBehavior(userId, activityData);
      
      // Check for brigading/coordination
      const brigadingRisk = await this.brigadingDetector.detectCoordination(userId, activityData);
      
      // Combine risk signals
      riskAssessment.detailedFactors = {
        behavior: behaviorRisk,
        brigading: brigadingRisk
      };
      
      // Calculate overall risk level (weighted combination)
      riskAssessment.riskLevel = this.calculateOverallRisk(riskAssessment.detailedFactors);
      
      // Determine primary signals driving risk assessment
      riskAssessment.primarySignals = this.identifyPrimarySignals(riskAssessment.detailedFactors);
      
      // Determine recommended action based on risk level
      riskAssessment.recommendedAction = this.determineRecommendedAction(riskAssessment.riskLevel);
      
      // Log high-risk detections
      if (riskAssessment.riskLevel > this.THRESHOLDS.HIGH_RISK) {
        logger.warn('High bot risk detected', {
          userId,
          riskLevel: riskAssessment.riskLevel,
          primarySignals: riskAssessment.primarySignals
        });
        this.detectionStats.botDetections++;
      }
      
      return riskAssessment;
    } catch (error) {
      logger.error('Failed to analyze activity for bot detection', {
        userId,
        error: error.message
      });
      
      // Return a default low-confidence assessment on error
      return {
        userId,
        timestamp: new Date().toISOString(),
        riskLevel: 0.1,
        primarySignals: ['analysis_error'],
        detailedFactors: { error: error.message },
        recommendedAction: 'monitor'
      };
    }
  }

  /**
   * Calculate overall risk level from multiple detection factors
   * 
   * @param {Object} factors - Detection factors from different analyzers
   * @returns {Number} - Overall risk level (0-1)
   */
  calculateOverallRisk(factors) {
    // Behavior factors are most important
    const behaviorWeight = 0.6;
    const behaviorRisk = factors.behavior?.riskLevel || 0;
    
    // Brigading/coordination factors are secondary
    const brigadingWeight = 0.4;
    const brigadingRisk = factors.brigading?.riskLevel || 0;
    
    // Calculate weighted average
    const weightedRisk = (behaviorRisk * behaviorWeight) + (brigadingRisk * brigadingWeight);
    
    // Cap risk level between 0 and 1
    return Math.max(0, Math.min(1, weightedRisk));
  }

  /**
   * Identify primary signals driving the risk assessment
   * 
   * @param {Object} factors - Detection factors from different analyzers
   * @returns {Array} - List of primary signals
   */
  identifyPrimarySignals(factors) {
    const primarySignals = [];
    
    // Extract top signals from behavior analysis
    if (factors.behavior && factors.behavior.signals) {
      // Get top 2 behavior signals
      const behaviorSignals = Object.entries(factors.behavior.signals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([signal, _]) => `behavior_${signal}`);
      
      primarySignals.push(...behaviorSignals);
    }
    
    // Extract top signals from brigading detection
    if (factors.brigading && factors.brigading.signals) {
      // Get top 2 brigading signals
      const brigadingSignals = Object.entries(factors.brigading.signals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([signal, _]) => `coordination_${signal}`);
      
      primarySignals.push(...brigadingSignals);
    }
    
    // Return up to 3 primary signals
    return primarySignals.slice(0, 3);
  }

  /**
   * Determine recommended action based on risk level
   * 
   * @param {Number} riskLevel - Overall risk level (0-1)
   * @returns {String} - Recommended action
   */
  determineRecommendedAction(riskLevel) {
    if (riskLevel > this.THRESHOLDS.CRITICAL_RISK) {
      return 'block';
    } else if (riskLevel > this.THRESHOLDS.HIGH_RISK) {
      return 'challenge_high';
    } else if (riskLevel > this.THRESHOLDS.MEDIUM_RISK) {
      return 'challenge_medium';
    } else if (riskLevel > this.THRESHOLDS.LOW_RISK) {
      return 'monitor';
    } else {
      return 'none';
    }
  }

  /**
   * Initiate a verification challenge for a user
   * 
   * @param {String} userId - User ID to challenge
   * @param {Object} options - Challenge options
   * @returns {Promise<Object>} - Challenge results
   */
  async initiateVerificationChallenge(userId, options = {}) {
    try {
      // Determine challenge level if not specified
      if (!options.challengeLevel) {
        const { riskLevel } = await this.analyzeActivity(userId, {});
        options.challengeLevel = riskLevel > this.THRESHOLDS.HIGH_RISK ? 'high' : 'medium';
      }
      
      // Generate challenge
      const challenge = await this.verificationChallenge.generateChallenge(
        userId, 
        options.challengeLevel
      );
      
      logger.info('Initiated verification challenge', {
        userId,
        challengeLevel: options.challengeLevel,
        challengeId: challenge.id
      });
      
      this.detectionStats.challengesIssued++;
      
      return challenge;
    } catch (error) {
      logger.error('Failed to initiate verification challenge', {
        userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Verify a challenge response from a user
   * 
   * @param {String} userId - User ID
   * @param {String} challengeId - Challenge ID
   * @param {String|Object} response - User's response to the challenge
   * @returns {Promise<Object>} - Verification result
   */
  async verifyChallenge(userId, challengeId, response) {
    try {
      // Verify the challenge
      const result = await this.verificationChallenge.verifyResponse(
        userId,
        challengeId,
        response
      );
      
      // Update stats based on result
      if (result.passed) {
        this.detectionStats.challengesPassed++;
        
        // Record false positive if the risk was high
        if (result.originalRiskLevel > this.THRESHOLDS.HIGH_RISK) {
          this.detectionStats.falsePositives++;
        }
      } else {
        this.detectionStats.challengesFailed++;
      }
      
      logger.info('Verification challenge result', {
        userId,
        challengeId,
        passed: result.passed
      });
      
      return result;
    } catch (error) {
      logger.error('Failed to verify challenge response', {
        userId,
        challengeId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Enhance monitoring for a user
   * 
   * @param {String} userId - User ID to monitor
   * @returns {Promise<Object>} - Monitoring status
   */
  async enhanceMonitoring(userId) {
    try {
      // Apply enhanced monitoring settings
      await this.behaviorAnalyzer.enhanceMonitoring(userId);
      
      logger.info('Enhanced monitoring enabled', { userId });
      
      return {
        userId,
        enhancedMonitoring: true,
        timestamp: new Date().toISOString(),
        duration: '24h' // Enhanced monitoring for 24 hours
      };
    } catch (error) {
      logger.error('Failed to enhance monitoring', {
        userId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get current bot detection statistics
   * 
   * @returns {Object} - Detection statistics
   */
  getDetectionStats() {
    const stats = { ...this.detectionStats };
    
    // Calculate derived metrics
    stats.detectionRate = stats.totalAnalyzed > 0 
      ? stats.botDetections / stats.totalAnalyzed 
      : 0;
    
    stats.falsePositiveRate = stats.botDetections > 0 
      ? stats.falsePositives / stats.botDetections 
      : 0;
    
    stats.challengeSuccessRate = stats.challengesIssued > 0 
      ? stats.challengesPassed / stats.challengesIssued 
      : 0;
    
    return stats;
  }

  /**
   * Report a potential false positive
   * 
   * @param {String} userId - User ID incorrectly flagged
   * @param {String} reportReason - Reason for false positive report
   * @returns {Promise<Object>} - Report status
   */
  async reportFalsePositive(userId, reportReason) {
    try {
      logger.info('False positive report received', {
        userId,
        reportReason
      });
      
      this.detectionStats.falsePositives++;
      
      // In a real implementation, this would trigger a review process
      // and potentially adjust detection parameters
      
      return {
        userId,
        reportReceived: true,
        reviewStatus: 'pending',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to process false positive report', {
        userId,
        error: error.message
      });
      throw error;
    }
  }
}

// Create a singleton instance
const botDetectionService = new BotDetectionService();

module.exports = botDetectionService;