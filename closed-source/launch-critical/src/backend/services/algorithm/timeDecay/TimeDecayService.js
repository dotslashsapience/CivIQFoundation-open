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
 * TimeDecayService.js
 * 
 * This service handles time-based relevance decay for content in the CivIQ platform.
 * It applies appropriate decay curves to ensure content freshness while preventing
 * high-quality evergreen content from disappearing too quickly.
 * 
 * The time decay model balances recency with ongoing relevance, using specialized
 * decay curves for different content types.
 */

const { logger } = require('../../../utils/logger');
const config = require('../../../../../config/algorithm.config');

class TimeDecayService {
  constructor() {
    // Load configuration
    this.config = config?.components?.timeDecay || {};
    
    // Default half-life values if not in config
    this.defaultHalfLifeHours = {
      default: 24,        // General content
      breakingNews: 6,    // Breaking news decays faster
      discussion: 48,     // Discussions decay slower
      evergreen: 168      // Evergreen content decays very slowly (1 week)
    };
    
    // Minimum score floor (content never goes below this value)
    this.minimumScoreFloor = this.config.minimumScoreFloor || 0.1;
    
    logger.info('Time decay service initialized');
  }

  /**
   * Calculate decay factor for content based on age
   * 
   * @param {Date} createdAt - Content creation timestamp
   * @param {Number} halfLifeHours - Half-life in hours for this content type
   * @param {Object} options - Additional calculation options
   * @returns {Promise<Number>} - Decay factor (0-1)
   */
  async calculateDecayFactor(createdAt, halfLifeHours, options = {}) {
    try {
      // Calculate content age in hours
      const now = new Date();
      const ageMs = now - createdAt;
      const ageHours = ageMs / (1000 * 60 * 60);
      
      // Use provided half-life or default
      const halfLife = halfLifeHours || 
                      this.defaultHalfLifeHours[options.contentType] || 
                      this.defaultHalfLifeHours.default;
      
      // Apply quality modifier if enabled and content is high quality
      let effectiveHalfLife = halfLife;
      
      if (options.qualityDecayModifier?.enabled && 
          options.qualityScore >= (options.qualityDecayModifier.highQualityThreshold || 0.85)) {
        // Apply slowdown to half-life for high quality content
        const slowdown = options.qualityDecayModifier.decaySlowdown || 0.7;
        effectiveHalfLife = halfLife / slowdown;
      }
      
      // Calculate decay factor using exponential decay formula
      // decay = 2^(-age/halfLife)
      const decayFactor = Math.pow(2, -ageHours / effectiveHalfLife);
      
      // Apply minimum score floor
      const minimumFloor = options.minimumScoreFloor || this.minimumScoreFloor;
      
      return Math.max(decayFactor, minimumFloor);
    } catch (error) {
      logger.warn('Error calculating time decay factor', {
        createdAt,
        halfLifeHours,
        error: error.message
      });
      
      // Return moderate decay on error
      return 0.5;
    }
  }

  /**
   * Calculate half-life for specific content
   * 
   * @param {Object} contentData - Content metadata
   * @returns {Number} - Recommended half-life in hours
   */
  calculateContentHalfLife(contentData) {
    try {
      // Get the base half-life for this content type
      const contentType = contentData.contentType || 'default';
      const baseHalfLife = this.config.halfLifeHours?.[contentType] || 
                           this.defaultHalfLifeHours[contentType] || 
                           this.defaultHalfLifeHours.default;
      
      // Apply modifiers based on content attributes
      let modifiedHalfLife = baseHalfLife;
      
      // Increase half-life for high-quality content
      if (contentData.qualityScore >= 0.8) {
        modifiedHalfLife *= 1.5; // 50% increase
      }
      
      // Decrease half-life for time-sensitive content
      if (contentData.timeSensitive) {
        modifiedHalfLife *= 0.7; // 30% decrease
      }
      
      // Increase half-life for reference content
      if (contentData.isReference) {
        modifiedHalfLife *= 2.0; // 100% increase
      }
      
      return modifiedHalfLife;
    } catch (error) {
      logger.warn('Error calculating content half-life', {
        contentType: contentData.contentType,
        error: error.message
      });
      
      // Return default half-life on error
      return this.defaultHalfLifeHours.default;
    }
  }

  /**
   * Calculate boost factor for trending content
   * 
   * @param {Object} contentData - Content metadata with engagement metrics
   * @returns {Number} - Trending boost factor (>= 1.0)
   */
  calculateTrendingBoost(contentData) {
    try {
      // Check if content has recent engagement data
      if (!contentData.recentEngagement) {
        return 1.0; // No boost without engagement data
      }
      
      // Calculate engagement velocity (activity per hour)
      const hoursSinceCreation = (new Date() - new Date(contentData.createdAt)) / (1000 * 60 * 60);
      
      if (hoursSinceCreation < 1) {
        return 1.0; // Too new to calculate meaningful velocity
      }
      
      // Calculate engagement velocity
      const engagementVelocity = contentData.recentEngagement / hoursSinceCreation;
      
      // Apply boost based on velocity
      // Higher velocity = larger boost
      if (engagementVelocity > 100) {
        return 1.5; // Very high engagement
      } else if (engagementVelocity > 50) {
        return 1.3; // High engagement
      } else if (engagementVelocity > 20) {
        return 1.2; // Moderate engagement
      } else if (engagementVelocity > 10) {
        return 1.1; // Slight engagement
      }
      
      return 1.0; // No boost
    } catch (error) {
      logger.warn('Error calculating trending boost', {
        contentId: contentData.id,
        error: error.message
      });
      
      // Return no boost on error
      return 1.0;
    }
  }

  /**
   * Apply time-based boosting for specific time periods
   * 
   * @param {Date} createdAt - Content creation timestamp
   * @param {Object} options - Boost options
   * @returns {Number} - Time-based boost factor
   */
  applyTimeBasedBoost(createdAt, options = {}) {
    try {
      // Check for prime time boost
      // Prime time is defined as high-activity periods
      const now = new Date();
      const hour = now.getHours();
      
      // Example prime time: 7-9 AM and 7-10 PM
      const isPrimeTime = (hour >= 7 && hour <= 9) || (hour >= 19 && hour <= 22);
      
      if (isPrimeTime && options.primTimeBoost) {
        return options.primTimeBoost; // Default: 1.2
      }
      
      // Check for weekend boost
      const day = now.getDay();
      const isWeekend = day === 0 || day === 6; // Sunday or Saturday
      
      if (isWeekend && options.weekendBoost) {
        return options.weekendBoost; // Default: 1.1
      }
      
      return 1.0; // No time-based boost
    } catch (error) {
      logger.warn('Error applying time-based boost', {
        error: error.message
      });
      
      // Return no boost on error
      return 1.0;
    }
  }
}

module.exports = TimeDecayService;