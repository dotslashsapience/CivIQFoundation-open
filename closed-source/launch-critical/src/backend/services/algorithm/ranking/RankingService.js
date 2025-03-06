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
 * RankingService.js
 * 
 * This service implements CivIQ's core content ranking algorithm, which
 * determines what content appears in users' feeds and in what order.
 * The ranking system aims to prioritize high-quality, civil discourse
 * while ensuring viewpoint diversity and resisting manipulation.
 * 
 * Unlike traditional engagement-driven algorithms, this system weighs
 * credibility, constructiveness, and diversity along with recency.
 */

const { logger } = require('../../../utils/logger');
const config = require('../../../../../config/algorithm.config');
const CredibilityService = require('../credibility/CredibilityService');
const DiversityEngine = require('../diversityEngine/DiversityEngine');
const TimeDecayService = require('../timeDecay/TimeDecayService');
const TransparencyService = require('../transparency/TransparencyService');

class RankingService {
  constructor() {
    // Load configuration
    this.config = config || {};
    this.componentsConfig = this.config.components || {};
    
    // Initialize sub-services
    this.credibilityService = new CredibilityService();
    this.diversityEngine = new DiversityEngine();
    this.timeDecayService = new TimeDecayService();
    this.transparencyService = new TransparencyService();
    
    logger.info('Ranking service initialized');
  }

  /**
   * Rank a batch of content items
   * 
   * @param {Array} contentItems - Array of content items to rank
   * @param {Object} options - Ranking options and context
   * @returns {Promise<Array>} - Ranked content items with scores
   */
  async rankBatch(contentItems, options = {}) {
    try {
      logger.info('Ranking content batch', { 
        itemCount: contentItems.length,
        options 
      });
      
      // Default options
      const defaultOptions = {
        prioritizeCredibility: true,
        diversityThreshold: 0.4,
        timeDecayModel: 'standard'
      };
      
      const rankingOptions = { ...defaultOptions, ...options };
      
      // Calculate individual scores for each ranking component
      const scoredItems = await Promise.all(contentItems.map(async (item) => {
        // Create a copy of the item to avoid modifying the original
        const scoredItem = { ...item, _ranking: {} };
        
        // Calculate component scores
        scoredItem._ranking.credibility = await this.calculateCredibilityScore(item);
        scoredItem._ranking.engagement = await this.calculateEngagementScore(item);
        scoredItem._ranking.diversity = await this.calculateDiversityScore(item, rankingOptions);
        scoredItem._ranking.timeDecay = await this.calculateTimeDecayFactor(item, rankingOptions);
        scoredItem._ranking.manipulation = await this.calculateManipulationPenalty(item);
        
        // Calculate final score using weighted components
        scoredItem._ranking.finalScore = this.calculateFinalScore(scoredItem._ranking);
        
        return scoredItem;
      }));
      
      // Sort items by final score (descending)
      const rankedItems = scoredItems.sort((a, b) => {
        return b._ranking.finalScore - a._ranking.finalScore;
      });
      
      // Apply post-processing to ensure diversity requirements
      const finalRanking = this.applyPostProcessing(rankedItems, rankingOptions);
      
      return finalRanking;
    } catch (error) {
      logger.error('Failed to rank content batch', { error: error.message });
      throw error;
    }
  }

  /**
   * Calculate credibility score for content
   * 
   * @param {Object} item - Content item
   * @returns {Promise<Number>} - Credibility score (0-1)
   */
  async calculateCredibilityScore(item) {
    try {
      // Use credibility service to calculate score
      const credibilityScore = await this.credibilityService.evaluateContent(item);
      
      // Apply adjustments from configuration
      const credConfig = this.componentsConfig.credibility || {};
      
      // Apply high credibility boost if applicable
      if (credibilityScore > (credConfig.highCredibilityThreshold || 0.75)) {
        return credibilityScore * 1.1; // 10% boost
      }
      
      // Apply low credibility penalty if applicable
      if (credibilityScore < (credConfig.lowCredibilityThreshold || 0.3)) {
        return credibilityScore * (credConfig.lowCredibilityPenalty || 0.8); // 20% penalty
      }
      
      return credibilityScore;
    } catch (error) {
      logger.warn('Error calculating credibility score', {
        contentId: item.id,
        error: error.message
      });
      
      // Return neutral score on error
      return 0.5;
    }
  }

  /**
   * Calculate engagement quality score
   * 
   * @param {Object} item - Content item
   * @returns {Promise<Number>} - Engagement score (0-1)
   */
  async calculateEngagementScore(item) {
    try {
      // In a real implementation, this would analyze the quality
      // of engagement, not just quantity
      
      // Mock implementation for demonstration
      const engagementMetrics = {
        commentQuality: item.commentQuality || 0.5,
        civility: item.commentCivility || 0.5,
        constructiveness: item.commentConstructiveness || 0.5,
        diversityOfEngagement: item.engagementDiversity || 0.5
      };
      
      // Get weights from configuration
      const engConfig = this.componentsConfig.engagement || {};
      const factors = engConfig.factors || {
        commentQuality: 0.35,
        civility: 0.30,
        constructiveness: 0.25,
        diversityOfEngagement: 0.10
      };
      
      // Calculate weighted score
      let score = 0;
      let totalWeight = 0;
      
      for (const [metric, weight] of Object.entries(factors)) {
        score += (engagementMetrics[metric] || 0.5) * weight;
        totalWeight += weight;
      }
      
      const engagementScore = totalWeight > 0 ? score / totalWeight : 0.5;
      
      // Apply high quality engagement boost if applicable
      if (engagementScore > 0.8 && engConfig.highQualityEngagementBoost) {
        return engagementScore * engConfig.highQualityEngagementBoost;
      }
      
      // Apply toxic engagement penalty if applicable
      if (engagementScore < 0.3 && engConfig.toxicEngagementPenalty) {
        return engagementScore * engConfig.toxicEngagementPenalty;
      }
      
      return engagementScore;
    } catch (error) {
      logger.warn('Error calculating engagement score', {
        contentId: item.id,
        error: error.message
      });
      
      // Return neutral score on error
      return 0.5;
    }
  }

  /**
   * Calculate diversity contribution score
   * 
   * @param {Object} item - Content item
   * @param {Object} options - Ranking options
   * @returns {Promise<Number>} - Diversity score (0-1)
   */
  async calculateDiversityScore(item, options) {
    try {
      // Use diversity engine to calculate contribution to viewpoint diversity
      const diversityScore = await this.diversityEngine.calculateDiversityContribution(
        item,
        options.diversityThreshold
      );
      
      // Get diversity config
      const divConfig = this.componentsConfig.diversity || {};
      
      // Apply diversity boost if configured
      if (diversityScore > 0.7 && divConfig.diversityBoostFactor) {
        return diversityScore * divConfig.diversityBoostFactor;
      }
      
      return diversityScore;
    } catch (error) {
      logger.warn('Error calculating diversity score', {
        contentId: item.id,
        error: error.message
      });
      
      // Return neutral score on error
      return 0.5;
    }
  }

  /**
   * Calculate time decay factor
   * 
   * @param {Object} item - Content item
   * @param {Object} options - Ranking options
   * @returns {Promise<Number>} - Time decay factor (0-1)
   */
  async calculateTimeDecayFactor(item, options) {
    try {
      // Get content creation time
      const createdAt = new Date(item.createdAt || Date.now());
      
      // Get time decay configuration
      const decayConfig = this.componentsConfig.timeDecay || {};
      
      // Determine content type for half-life calculation
      const contentType = item.contentType || options.timeDecayModel || 'default';
      
      // Get half-life for this content type
      const halfLifeHours = decayConfig.halfLifeHours?.[contentType] || 
                           decayConfig.halfLifeHours?.default || 
                           24;
      
      // Calculate time decay factor using time decay service
      const decayFactor = await this.timeDecayService.calculateDecayFactor(
        createdAt,
        halfLifeHours,
        {
          qualityScore: item.qualityScore,
          minimumScoreFloor: decayConfig.minimumScoreFloor || 0.1,
          qualityDecayModifier: decayConfig.qualityDecayModifier
        }
      );
      
      return decayFactor;
    } catch (error) {
      logger.warn('Error calculating time decay factor', {
        contentId: item.id,
        error: error.message
      });
      
      // Return moderate decay on error
      return 0.5;
    }
  }

  /**
   * Calculate manipulation penalty
   * 
   * @param {Object} item - Content item
   * @returns {Promise<Number>} - Manipulation penalty factor (0-1, lower is worse)
   */
  async calculateManipulationPenalty(item) {
    try {
      // In a real implementation, this would analyze signals of
      // manipulation or artificial boosting
      
      // Mock implementation
      const manipulationSignals = {
        artificialEngagement: item.artificialEngagement || 0.1,
        coordinated: item.coordinatedActivity || 0.1,
        abnormalPattern: item.abnormalPattern || 0.1,
        botLikeActivity: item.botActivity || 0.1
      };
      
      // Get manipulation config
      const manipConfig = this.componentsConfig.manipulation || {};
      const signals = manipConfig.signals || {
        artificialEngagement: 0.40,
        coordinated: 0.30,
        abnormalPattern: 0.20,
        botLikeActivity: 0.10
      };
      
      // Calculate weighted manipulation score
      let score = 0;
      let totalWeight = 0;
      
      for (const [signal, weight] of Object.entries(signals)) {
        score += (manipulationSignals[signal] || 0) * weight;
        totalWeight += weight;
      }
      
      const manipulationScore = totalWeight > 0 ? score / totalWeight : 0;
      
      // Apply penalty if above threshold
      const penaltyThreshold = manipConfig.penaltyThreshold || 0.65;
      const maxPenaltyFactor = manipConfig.maxPenaltyFactor || 0.5;
      
      if (manipulationScore > penaltyThreshold) {
        // Calculate penalty factor (1.0 = no penalty, lower values = higher penalty)
        const penaltyFactor = 1.0 - (maxPenaltyFactor * 
          ((manipulationScore - penaltyThreshold) / (1 - penaltyThreshold)));
        
        return penaltyFactor;
      }
      
      // No penalty
      return 1.0;
    } catch (error) {
      logger.warn('Error calculating manipulation penalty', {
        contentId: item.id,
        error: error.message
      });
      
      // Return no penalty on error
      return 1.0;
    }
  }

  /**
   * Calculate final score from component scores
   * 
   * @param {Object} scores - Component scores
   * @returns {Number} - Final ranking score (0-1)
   */
  calculateFinalScore(scores) {
    // Get component weights from configuration
    const weightConfig = {
      credibility: this.componentsConfig.credibility?.weight || 0.30,
      engagement: this.componentsConfig.engagement?.weight || 0.25,
      diversity: this.componentsConfig.diversity?.weight || 0.20,
      timeDecay: this.componentsConfig.timeDecay?.weight || 0.15
    };
    
    // Calculate weighted sum of scores
    let finalScore = 0;
    let totalWeight = 0;
    
    // Add weighted credibility score
    finalScore += scores.credibility * weightConfig.credibility;
    totalWeight += weightConfig.credibility;
    
    // Add weighted engagement score
    finalScore += scores.engagement * weightConfig.engagement;
    totalWeight += weightConfig.engagement;
    
    // Add weighted diversity score
    finalScore += scores.diversity * weightConfig.diversity;
    totalWeight += weightConfig.diversity;
    
    // Add weighted time decay factor
    finalScore += scores.timeDecay * weightConfig.timeDecay;
    totalWeight += weightConfig.timeDecay;
    
    // Normalize to 0-1 range
    const normalizedScore = totalWeight > 0 ? finalScore / totalWeight : 0.5;
    
    // Apply manipulation penalty
    return normalizedScore * scores.manipulation;
  }

  /**
   * Apply post-processing to ensure diversity and other requirements
   * 
   * @param {Array} rankedItems - Ranked content items
   * @param {Object} options - Ranking options
   * @returns {Array} - Final processed ranking
   */
  applyPostProcessing(rankedItems, options) {
    try {
      // Apply randomization factor if configured
      if (this.config.feed?.randomizationFactor) {
        return this.applyRandomization(rankedItems, this.config.feed.randomizationFactor);
      }
      
      // For now, just return the ranked items as is
      return rankedItems;
    } catch (error) {
      logger.warn('Error applying post-processing', { error: error.message });
      
      // Return original ranking on error
      return rankedItems;
    }
  }

  /**
   * Apply slight randomization to prevent identical feeds
   * 
   * @param {Array} rankedItems - Ranked content items
   * @param {Number} factor - Randomization factor (0-1)
   * @returns {Array} - Randomized ranking
   */
  applyRandomization(rankedItems, factor) {
    // Ensure factor is within valid range
    const randomizationFactor = Math.max(0, Math.min(factor || 0.05, 0.5));
    
    // If factor is effectively zero, return original ranking
    if (randomizationFactor < 0.01) {
      return rankedItems;
    }
    
    // Apply randomization
    return rankedItems.map(item => {
      // Create a copy of the item
      const randomizedItem = { ...item };
      
      // Apply random adjustment to final score
      const randomAdjustment = (Math.random() * 2 - 1) * randomizationFactor;
      randomizedItem._ranking.finalScore += randomizedItem._ranking.finalScore * randomAdjustment;
      
      return randomizedItem;
    })
    // Re-sort after randomization
    .sort((a, b) => b._ranking.finalScore - a._ranking.finalScore);
  }

  /**
   * Explain ranking for a content item
   * 
   * @param {Object} item - Content item with ranking data
   * @returns {Promise<Object>} - Transparent explanation of ranking
   */
  async explainRanking(item) {
    try {
      // Use transparency service to generate explanation
      return await this.transparencyService.explainRanking(item);
    } catch (error) {
      logger.warn('Error explaining ranking', {
        contentId: item.id,
        error: error.message
      });
      
      // Return basic explanation on error
      return {
        contentId: item.id,
        finalScore: item._ranking?.finalScore || 0,
        explanation: "Ranking explanation unavailable"
      };
    }
  }

  /**
   * Generate transparency data for a batch of ranked items
   * 
   * @param {Array} rankedItems - Ranked content items
   * @returns {Promise<Array>} - Items with transparency data
   */
  async explainRankingBatch(rankedItems) {
    try {
      // Generate explanations for each item
      const explanations = await Promise.all(
        rankedItems.map(item => this.explainRanking(item))
      );
      
      // Combine items with their explanations
      return rankedItems.map((item, index) => {
        return {
          ...item,
          _explanation: explanations[index]
        };
      });
    } catch (error) {
      logger.error('Failed to explain rankings batch', { error: error.message });
      
      // Return items without explanations
      return rankedItems;
    }
  }
}

module.exports = RankingService;