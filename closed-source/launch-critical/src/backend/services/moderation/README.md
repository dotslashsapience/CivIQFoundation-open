# CivIQ Moderation & Civility Service

This directory contains the launch-critical moderation systems for CivIQ, designed to maintain quality discourse while respecting diverse viewpoints and free expression.

## Core Mission

To foster a constructive, civil environment for public discourse through fair, transparent, and consistent moderation practices that prioritize quality conversation without ideological bias.

## Key Features

- **AI-Assisted Moderation**: Advanced content analysis with human oversight
- **Civility Scoring**: User reputation system based on constructive participation
- **Community Moderation**: Distributed moderation with weighted user input
- **Transparent Appeals**: Clear process for challenging moderation decisions
- **Rule Enforcement**: Consistent application of community standards
- **Anti-Toxicity Measures**: Prevention of harassment and destructive behavior

## Module Structure

```
/moderation/
├── ai/                - AI-assisted moderation tools and services
├── appeals/           - Moderation decision appeals process
├── civilityScore/     - User civility reputation system
├── flags/             - Content flagging and reporting system
├── human/             - Human moderator tools and workflows
├── metrics/           - Moderation effectiveness and fairness reporting
└── rules/             - Platform rules and enforcement guidelines
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+ (for caching and rate limiting)
- NLP pipeline for content analysis
- Queue system (RabbitMQ/Redis) for moderation tasks

### Installation

```bash
# Install dependencies for all moderation modules
npm install --prefix src/backend/services/moderation

# Configure your environment variables
cp .env.example .env
```

Edit the `.env` file with your specific configuration for databases, AI services, and feature toggles.

### Configuration

The main configuration file is at `config/moderation.config.js`. This defines:

- Toxicity thresholds and detection settings
- Civility score calculation parameters
- Appeals process workflow configuration
- AI vs. human moderation balancing
- Community moderation weightings

## Architecture

### Moderation Pipeline

The moderation system operates through a multi-stage pipeline:

1. **Pre-Publishing Analysis**: Optional proactive checks during content creation
2. **AI Screening**: Automated analysis of published content
3. **User Flagging**: Community-based issue reporting
4. **Moderator Review**: Human assessment of flagged content
5. **Action Application**: Graduated response based on severity
6. **Appeals Processing**: Review of contested decisions

### Civility Scoring System

The reputation system tracks and rewards constructive participation:

1. **Baseline Score**: All users begin with neutral civility score
2. **Constructive Contributions**: Score increases for valued participation
3. **Rule Violations**: Score decreases for rule-breaking behavior
4. **Impact Weighting**: Score influences content visibility and moderation weight
5. **Recovery Path**: Clear process for score improvement over time

## Implementation Guide

To implement moderation-related features:

1. Use the `ModerationService` for all content screening operations
2. Implement the `IModeratable` interface on all content models
3. Use `CivilityScoreService` to manage user reputation changes
4. Apply moderation rules consistently via the central rule service
5. Handle appeals through the established appeals pipeline

### Moderation Process Implementation

```javascript
// Example moderation process
const moderateContent = async (content, authorId) => {
  const moderationService = new ModerationService();
  
  // Process content through moderation pipeline
  const moderationResult = await moderationService.evaluate(content, {
    contentType: content.type,
    authorId: authorId,
    contextualData: content.context
  });
  
  // Handle moderation decision
  if (moderationResult.action !== 'approve') {
    await moderationService.applyAction(content.id, moderationResult.action, {
      reason: moderationResult.reasons,
      appealable: moderationResult.appealable,
      visibility: moderationResult.visibility
    });
    
    // Update civility score if applicable
    if (moderationResult.civilityImpact) {
      await civilityService.adjustScore(authorId, 
        moderationResult.civilityImpact, 
        moderationResult.reasons
      );
    }
  }
  
  return moderationResult;
};
```

## Quality Metrics and Monitoring

The system tracks key performance indicators:

- Accuracy of AI moderation decisions
- Community moderation effectiveness
- User civility score distribution
- Appeals rates and resolution outcomes
- Moderation action impact on user retention
- Demographic balance in moderation outcomes

## Security and Fairness Considerations

- All moderation decisions must have clear, documented reasons
- Moderation guidelines must apply equally regardless of viewpoint
- Regular audits of moderation outcomes for bias
- Civility scores must resist gaming and manipulation
- Appeals process must be accessible and timely

## Related Services

- Bot Detection Service
- Algorithm & Ranking Service
- Identity Verification Service
- Community Management Service

## Contributing

See our [Contribution Guidelines](../../../CONTRIBUTING.md) for information on how to contribute to this critical system.


## License

This component is licensed under the GNU Affero General Public License Version 3 (AGPL-3.0), the same license used for the overall CivIQ Platform. The AGPL-3.0 license ensures that the source code remains open and available to all users, even when the platform is being provided as a service over a network.

For more details, see the [LICENSE.md](../../../../../LICENSE.md) file in the project root.

Copyright © 2025 CivIQ Platform
