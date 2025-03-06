# CivIQ Algorithm & Content Ranking Service

This directory contains the launch-critical algorithm services for CivIQ, designed to create a feed system that prioritizes quality discourse, prevents echo chambers, and resists manipulation.

## Core Mission

To provide a transparent, fair, and manipulation-resistant content ranking system that promotes high-quality civic discourse while ensuring diverse viewpoints are represented.

## Key Features

- **Credibility-Weighted Ranking**: Content ranked based on source reliability and argument quality
- **Constructive Engagement**: Metrics for promoting civil, productive conversations
- **Viewpoint Diversity**: Prevention of echo chambers and filter bubbles
- **Anti-Manipulation**: Resistance to gaming, brigading, and artificial boosting
- **Time Decay**: Balanced approach to content freshness vs. ongoing relevance
- **Transparent Ranking**: Explainable decisions on content positioning

## Module Structure

```
/algorithm/
├── credibility/        - Source and content credibility assessment
├── diversityEngine/    - Viewpoint diversity promotion systems
├── engagement/         - Quality engagement measurement metrics
├── moderation/         - Integration with moderation outcomes
├── ranking/            - Core ranking algorithm implementation
├── timeDecay/          - Time-based relevance decay functions
└── transparency/       - Ranking explanation and transparency tools
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+ (for caching and rate limiting)
- Vector database (e.g., Pinecone, Weaviate) for semantic analysis

### Installation

```bash
# Install dependencies for all algorithm modules
npm install --prefix src/backend/services/algorithm

# Configure your environment variables
cp .env.example .env
```

Edit the `.env` file with your specific configuration for databases, machine learning services, and feature toggles.

### Configuration

The main configuration file is at `config/algorithm.config.js`. This defines:

- Weighting factors for different ranking signals
- Diversity thresholds and balance parameters
- Time decay curves and factors
- Feature toggles for ranking components
- Transparency level configuration

## Architecture

### Ranking Pipeline

The content ranking system operates through a sequential pipeline:

1. **Content Analysis**: Assess content credibility, quality, and characteristics
2. **Engagement Evaluation**: Measure quality and type of engagement
3. **User Context**: Consider user history and diversity needs (without personalization)
4. **Signal Weighting**: Apply weighted scoring across multiple factors
5. **Final Ranking**: Combine all signals into final position
6. **Transparency Layer**: Generate explanations for ranking decisions

### Key Ranking Signals

The algorithm considers these primary signals:

- **Credibility Score**: Quality of sources, reasoning, and factual accuracy
- **Civility Metrics**: Tone, constructiveness, and respectfulness
- **Engagement Quality**: Types of responses and their quality
- **Diversity Impact**: Contribution to viewpoint diversity in the feed
- **Time Relevance**: Age of content with topic-specific decay rates
- **Expert Recognition**: Verification status and domain expertise

## Implementation Guide

To implement or extend the ranking algorithm:

1. New ranking signals must implement the `IRankingSignal` interface
2. Use the `SignalWeightingService` to integrate into the ranking pipeline
3. Add transparency explanations for any new signals
4. Implement A/B testing for significant changes
5. Document the expected impact on content visibility

### Ranking Process Implementation

```javascript
// Example ranking process
const rankContent = async (contentItems, contextParams) => {
  const rankingService = new AlgorithmService();
  
  // Process all ranking signals
  const rankedResults = await rankingService.rankBatch(contentItems, {
    prioritizeCredibility: contextParams.credibilityFocus || true,
    diversityThreshold: contextParams.diversityNeeded || 0.4,
    timeDecayModel: contextParams.contentType || 'standard'
  });
  
  // Generate transparency data
  const explainedResults = await rankingService.explainRanking(rankedResults);
  
  return explainedResults;
};
```

## Quality Metrics and Monitoring

The system tracks key performance indicators:

- Viewpoint diversity scoring
- Content quality assessment
- Gaming and manipulation attempts
- User engagement quality distribution
- Time spent with ranked content
- Feedback on ranking explanations

## Security and Anti-Manipulation

- All ranking signals include anti-gaming measures
- Coordinated activity detection to prevent manipulation
- Regular analysis of ranking outcomes for bias
- Challenge-based verification for suspicious patterns
- Isolation of experimental ranking features

## Related Services

- Moderation Service
- Bot Detection Service
- Identity Verification
- Content Analysis Service

## Contributing

See our [Contribution Guidelines](../../../CONTRIBUTING.md) for information on how to contribute to this critical system.

## License

This component is licensed under the GNU Affero General Public License Version 3 (AGPL-3.0), the same license used for the overall CivIQ Platform. The AGPL-3.0 license ensures that the source code remains open and available to all users, even when the platform is being provided as a service over a network.

For more details, see the [LICENSE.md](../../../../../LICENSE.md) file in the project root.

Copyright © 2025 CivIQ Platform