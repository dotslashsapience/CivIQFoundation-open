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
 * BehaviorAnalyzer.js
 * 
 * This module analyzes user behavior patterns to identify automated accounts
 * or coordinated inauthentic behavior. It uses a combination of timing analysis,
 * interaction patterns, content similarity, and activity distributions to
 * detect non-human behaviors.
 * 
 * The analyzer provides risk scores for different behavior patterns that
 * may indicate bot activity or manipulation attempts.
 */

const { logger } = require('../../../utils/logger');
const config = require('../../../../../config/botDetection.config');

// Behavior signals and their risk patterns
const BEHAVIOR_SIGNALS = {
  // Timing-related signals
  ACTION_TIMING: {
    // Extremely regular timing between actions
    regularity: { weight: 0.7, threshold: 0.85 },
    // Actions performed at inhuman speed
    speed: { weight: 0.8, threshold: 0.9 },
    // Activity outside normal human patterns (e.g., no sleep)
    patterns: { weight: 0.6, threshold: 0.85 }
  },
  
  // Content-related signals
  CONTENT_PATTERNS: {
    // Repeated identical or near-identical content
    repetition: { weight: 0.7, threshold: 0.8 },
    // Content that follows templated patterns
    templating: { weight: 0.6, threshold: 0.85 },
    // Content that shows no contextual understanding
    contextual: { weight: 0.5, threshold: 0.9 }
  },
  
  // Interaction-related signals
  INTERACTION_PATTERNS: {
    // No response to replies or mentions
    unresponsiveness: { weight: 0.4, threshold: 0.85 },
    // Interactions that don't show understanding of context
    contextMismatch: { weight: 0.6, threshold: 0.9 },
    // Interactions that follow identical paths
    patternedInteractions: { weight: 0.7, threshold: 0.85 }
  },
  
  // Navigation-related signals
  NAVIGATION_PATTERNS: {
    // Navigating in ways that don't match human patterns
    inhuman: { weight: 0.5, threshold: 0.85 },
    // Direct URL access without normal navigation
    directAccess: { weight: 0.4, threshold: 0.9 },
    // Navigation without normal user friction (scrolling, etc.)
    friction: { weight: 0.6, threshold: 0.85 }
  }
};

class BehaviorAnalyzer {
  constructor() {
    // Load configuration
    this.config = config?.behaviorAnalysis || {};
    
    // Set weights for different signal categories
    this.categoryWeights = {
      ACTION_TIMING: 0.35,
      CONTENT_PATTERNS: 0.25,
      INTERACTION_PATTERNS: 0.20,
      NAVIGATION_PATTERNS: 0.20
    };
    
    // Users with enhanced monitoring
    this.enhancedMonitoringUsers = new Set();
    
    logger.info('Behavior analyzer initialized');
  }

  /**
   * Analyze user behavior for bot-like patterns
   * 
   * @param {String} userId - User ID to analyze
   * @param {Object} activityData - Activity data to analyze
   * @returns {Promise<Object>} - Behavior analysis results
   */
  async analyzeUserBehavior(userId, activityData) {
    try {
      // Determine if enhanced monitoring is active
      const isEnhancedMonitoring = this.enhancedMonitoringUsers.has(userId);
      
      // Gather historical data for this user
      // This would normally come from a database
      const historicalData = await this.getHistoricalData(userId);
      
      // Combine current activity with historical data
      const analysisData = {
        currentActivity: activityData,
        historicalData,
        isEnhancedMonitoring
      };
      
      // Initialize results object
      const analysisResults = {
        userId,
        timestamp: new Date().toISOString(),
        riskLevel: 0,
        signals: {},
        categories: {}
      };
      
      // Analyze each category of signals
      for (const [category, signals] of Object.entries(BEHAVIOR_SIGNALS)) {
        const categoryResults = {};
        
        // Analyze each signal within the category
        for (const [signal, config] of Object.entries(signals)) {
          const riskScore = await this.analyzeSignal(
            signal, 
            config, 
            analysisData
          );
          
          categoryResults[signal] = riskScore;
          
          // Add to overall signals list if above threshold
          if (riskScore >= config.threshold) {
            analysisResults.signals[signal] = riskScore;
          }
        }
        
        // Calculate category risk (average of signals)
        const categoryRisk = Object.values(categoryResults).reduce(
          (sum, score) => sum + score, 0
        ) / Object.values(categoryResults).length;
        
        analysisResults.categories[category] = categoryRisk;
      }
      
      // Calculate overall risk level (weighted average of categories)
      analysisResults.riskLevel = this.calculateOverallRisk(analysisResults.categories);
      
      return analysisResults;
    } catch (error) {
      logger.error('Failed to analyze user behavior', {
        userId,
        error: error.message
      });
      
      // Return a minimal result on error
      return {
        userId,
        timestamp: new Date().toISOString(),
        riskLevel: 0.1,
        signals: { error: 1.0 },
        categories: { error: 1.0 }
      };
    }
  }

  /**
   * Get historical behavior data for analysis
   * 
   * @param {String} userId - User ID
   * @returns {Promise<Object>} - Historical data
   */
  async getHistoricalData(userId) {
    // In a real implementation, this would query a database
    // for historical user behavior
    
    // Mock implementation - simplified historical data
    return {
      activityTimestamps: [
        // Array of timestamps for recent activities
        Date.now() - 3600000,
        Date.now() - 3500000,
        Date.now() - 3400000
      ],
      contentHashes: [
        // Hashes of recent content for similarity checking
        'hash1',
        'hash2',
        'hash3'
      ],
      interactionCounts: {
        // Counts of different types of interactions
        posts: 5,
        comments: 15,
        votes: 30,
        replies: 8
      },
      navigationPatterns: [
        // Recent navigation paths
        '/feed',
        '/post/123',
        '/user/456'
      ]
    };
  }

  /**
   * Analyze a specific behavior signal
   * 
   * @param {String} signal - Signal name
   * @param {Object} config - Signal configuration
   * @param {Object} data - Analysis data
   * @returns {Promise<Number>} - Risk score for this signal (0-1)
   */
  async analyzeSignal(signal, config, data) {
    // This is where the actual signal analysis would happen
    // Different signals require different analysis techniques
    
    // In a real implementation, this would apply specific detection
    // algorithms for each signal type
    
    // Mock implementation - generate risk scores based on signal type
    switch (signal) {
      // Timing related signals
      case 'regularity':
        return this.analyzeTimingRegularity(data);
      case 'speed':
        return this.analyzeActionSpeed(data);
      case 'patterns':
        return this.analyzeActivityPatterns(data);
        
      // Content related signals
      case 'repetition':
        return this.analyzeContentRepetition(data);
      case 'templating':
        return this.analyzeContentTemplating(data);
      case 'contextual':
        return this.analyzeContextualUnderstanding(data);
        
      // Interaction related signals
      case 'unresponsiveness':
        return this.analyzeUnresponsiveness(data);
      case 'contextMismatch':
        return this.analyzeContextMismatch(data);
      case 'patternedInteractions':
        return this.analyzePatternedInteractions(data);
        
      // Navigation related signals
      case 'inhuman':
        return this.analyzeInhumanNavigation(data);
      case 'directAccess':
        return this.analyzeDirectAccess(data);
      case 'friction':
        return this.analyzeUserFriction(data);
        
      default:
        // Default to low risk for unknown signals
        return 0.1;
    }
  }

  /**
   * Analyze timing regularity between actions
   * 
   * @param {Object} data - Analysis data
   * @returns {Number} - Risk score (0-1)
   */
  analyzeTimingRegularity(data) {
    // Simplified mock implementation
    // In reality, this would use statistical analysis to detect
    // unnaturally regular intervals between actions
    
    // If we have at least 3 timestamps
    if (data.historicalData.activityTimestamps.length >= 3) {
      const intervals = [];
      
      // Calculate intervals between timestamps
      for (let i = 1; i < data.historicalData.activityTimestamps.length; i++) {
        intervals.push(
          data.historicalData.activityTimestamps[i] - 
          data.historicalData.activityTimestamps[i-1]
        );
      }
      
      // Check standard deviation of intervals
      // (extremely low variance indicates bot-like regularity)
      const mean = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
      const variance = intervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);
      
      // Calculate coefficient of variation (normalized measure of dispersion)
      const cv = mean > 0 ? stdDev / mean : 0;
      
      // Low variance (CV < 0.1) is suspicious
      if (cv < 0.1) return 0.9;
      if (cv < 0.2) return 0.7;
      if (cv < 0.3) return 0.5;
      return 0.2;
    }
    
    // Not enough data
    return 0.1;
  }

  /**
   * Analyze action speed for inhuman patterns
   * 
   * @param {Object} data - Analysis data
   * @returns {Number} - Risk score (0-1)
   */
  analyzeActionSpeed(data) {
    // Simplified mock implementation
    // In reality, this would check for actions performed faster than
    // humanly possible
    
    // Placeholder implementation
    return 0.2;
  }

  /**
   * Analyze overall activity patterns for bot-like behavior
   * 
   * @param {Object} data - Analysis data
   * @returns {Number} - Risk score (0-1)
   */
  analyzeActivityPatterns(data) {
    // Simplified mock implementation
    // In reality, this would analyze activity patterns over time
    // to detect unnatural behavior (e.g., 24/7 activity with no breaks)
    
    // Placeholder implementation
    return 0.3;
  }

  /**
   * Analyze content for repetition
   * 
   * @param {Object} data - Analysis data
   * @returns {Number} - Risk score (0-1)
   */
  analyzeContentRepetition(data) {
    // Simplified mock implementation
    // In reality, this would check for repeated identical or near-identical
    // content using similarity measures
    
    // Placeholder implementation
    return 0.2;
  }

  /**
   * Analyze content for templated patterns
   * 
   * @param {Object} data - Analysis data
   * @returns {Number} - Risk score (0-1)
   */
  analyzeContentTemplating(data) {
    // Simplified mock implementation
    // In reality, this would detect content that follows rigid templates
    // or patterns typical of automated generation
    
    // Placeholder implementation
    return 0.3;
  }

  /**
   * Analyze content for contextual understanding
   * 
   * @param {Object} data - Analysis data
   * @returns {Number} - Risk score (0-1)
   */
  analyzeContextualUnderstanding(data) {
    // Simplified mock implementation
    // In reality, this would check if content shows understanding of
    // conversation context or just generic responses
    
    // Placeholder implementation
    return 0.2;
  }

  /**
   * Analyze user responsiveness to interactions
   * 
   * @param {Object} data - Analysis data
   * @returns {Number} - Risk score (0-1)
   */
  analyzeUnresponsiveness(data) {
    // Simplified mock implementation
    // In reality, this would check if a user ignores replies/mentions
    // in a way inconsistent with human behavior
    
    // Placeholder implementation
    return 0.1;
  }

  /**
   * Analyze interactions for context mismatches
   * 
   * @param {Object} data - Analysis data
   * @returns {Number} - Risk score (0-1)
   */
  analyzeContextMismatch(data) {
    // Simplified mock implementation
    // In reality, this would check if interactions don't make sense
    // in the context of the conversation
    
    // Placeholder implementation
    return 0.2;
  }

  /**
   * Analyze interactions for patterned behavior
   * 
   * @param {Object} data - Analysis data
   * @returns {Number} - Risk score (0-1)
   */
  analyzePatternedInteractions(data) {
    // Simplified mock implementation
    // In reality, this would check if interactions follow rigid
    // patterns typical of automated scripts
    
    // Placeholder implementation
    return 0.3;
  }

  /**
   * Analyze navigation for inhuman patterns
   * 
   * @param {Object} data - Analysis data
   * @returns {Number} - Risk score (0-1)
   */
  analyzeInhumanNavigation(data) {
    // Simplified mock implementation
    // In reality, this would check for navigation patterns that
    // don't match typical human browsing
    
    // Placeholder implementation
    return 0.2;
  }

  /**
   * Analyze for direct URL access without normal navigation
   * 
   * @param {Object} data - Analysis data
   * @returns {Number} - Risk score (0-1)
   */
  analyzeDirectAccess(data) {
    // Simplified mock implementation
    // In reality, this would check if a user directly accesses URLs
    // without normal discovery patterns
    
    // Placeholder implementation
    return 0.1;
  }

  /**
   * Analyze for lack of normal user friction
   * 
   * @param {Object} data - Analysis data
   * @returns {Number} - Risk score (0-1)
   */
  analyzeUserFriction(data) {
    // Simplified mock implementation
    // In reality, this would check for absence of normal user behaviors
    // like scrolling, mouse movements, etc.
    
    // Placeholder implementation
    return 0.2;
  }

  /**
   * Calculate overall risk from category risk levels
   * 
   * @param {Object} categories - Category risk levels
   * @returns {Number} - Overall risk (0-1)
   */
  calculateOverallRisk(categories) {
    let weightedSum = 0;
    let totalWeight = 0;
    
    // Calculate weighted sum of category risks
    for (const [category, risk] of Object.entries(categories)) {
      const weight = this.categoryWeights[category] || 0.1;
      weightedSum += risk * weight;
      totalWeight += weight;
    }
    
    // Return normalized risk score
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  /**
   * Enable enhanced monitoring for a user
   * 
   * @param {String} userId - User ID to monitor
   * @returns {Promise<Boolean>} - Success status
   */
  async enhanceMonitoring(userId) {
    try {
      // Add user to enhanced monitoring set
      this.enhancedMonitoringUsers.add(userId);
      
      // Set timeout to remove after 24 hours
      setTimeout(() => {
        this.enhancedMonitoringUsers.delete(userId);
        logger.info('Enhanced monitoring expired', { userId });
      }, 24 * 60 * 60 * 1000);
      
      logger.info('Enhanced monitoring enabled for user', { userId });
      return true;
    } catch (error) {
      logger.error('Failed to enable enhanced monitoring', {
        userId,
        error: error.message
      });
      return false;
    }
  }

  /**
   * Check if enhanced monitoring is active for a user
   * 
   * @param {String} userId - User ID to check
   * @returns {Boolean} - Whether enhanced monitoring is active
   */
  isEnhancedMonitoring(userId) {
    return this.enhancedMonitoringUsers.has(userId);
  }
}

module.exports = BehaviorAnalyzer;