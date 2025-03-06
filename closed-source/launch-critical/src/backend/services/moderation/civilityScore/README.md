# CivIQ Civility Score System

This directory contains the implementation of CivIQ's Civility Score system, a core component of the platform's moderation and quality discourse strategy.

## Overview

The Civility Score system is a reputation mechanism that measures and rewards constructive participation while identifying and addressing disruptive behavior. It directly influences content visibility, voting weight, and moderation influence, creating a self-reinforcing system for quality discourse.

## Key Features

- **User Reputation Tracking**: Measurement of constructive vs. disruptive behavior
- **Graduated Impact**: Non-binary approach with multiple tiers of influence
- **Transparent Recovery**: Clear path for users to improve their scores
- **Action-Based Adjustment**: Score changes directly tied to specific behaviors
- **Content Visibility Effects**: Higher civility leads to greater content reach
- **Community Moderation Weight**: More civil users have greater moderation influence

## Component Architecture

```
/civilityScore/
├── CivilityScoreService.js  - Core service for score management
├── ScoreCalculator.js       - Algorithm for score calculation
├── ActionHandler.js         - Processes actions that affect scores
├── RecoveryManager.js       - Manages score recovery processes
├── metrics/                 - Score distribution analytics
└── interfaces/              - TypeScript interfaces
```

## Implementation Details

### CivilityScoreService

The `CivilityScoreService` is the main entry point for Civility Score management. It provides functionality for:

- Calculating initial scores for new users
- Adjusting scores based on user actions
- Determining user moderation weight
- Setting content visibility based on civility
- Managing score recovery processes

### Score Calculation

The Civility Score system uses a weighted action model:

- Scores range from 0.0 to 1.0 (0% to 100%)
- New users start at 0.5 (50%) - a neutral position
- Positive actions increase score with diminishing returns
- Negative actions decrease score proportionally to severity
- Historical scores are weighted more heavily than recent actions
- Time-based passive recovery helps users improve scores gradually

### Score Tiers

The system defines multiple tiers:

| Tier | Score Range | Status |
|------|-------------|--------|
| Restricted | 0.0 - 0.2 | Severely limited platform access |
| Probation | 0.2 - 0.35 | Limited ability to participate |
| Limited | 0.35 - 0.5 | Reduced content visibility |
| Standard | 0.5 - 0.7 | Normal platform privileges |
| Trusted | 0.7 - 0.85 | Enhanced content visibility |
| Exemplary | 0.85 - 1.0 | Maximum influence and visibility |

## Usage Examples

### Adjusting User Scores

```javascript
const civilityScoreService = require('./CivilityScoreService');

// Record a positive user action
async function recordPositiveAction(userId, contentId) {
  const result = await civilityScoreService.adjustScore(userId, 'CONSTRUCTIVE_COMMENT', {
    contentId,
    impact: 1.2, // Higher impact for particularly constructive content
    reason: 'Helpful explanation with sources'
  });
  
  console.log(`Score changed from ${result.oldScore} to ${result.newScore}`);
  console.log(`User tier changed from ${result.oldTier} to ${result.newTier}`);
}

// Record a negative user action
async function recordNegativeAction(userId, contentId) {
  const result = await civilityScoreService.adjustScore(userId, 'TOXIC_COMMENT', {
    contentId,
    impact: 1.5, // Higher impact for particularly harmful content
    reason: 'Personal attack against another user',
    userTier: 'regular' // Used for applying appropriate multipliers
  });
  
  console.log(`Score changed from ${result.oldScore} to ${result.newScore}`);
}
```

### Getting User Moderation Weight

```javascript
const civilityScoreService = require('./CivilityScoreService');

async function getUserModerationInfluence(userId) {
  // Get user's moderation weight based on civility score
  const weight = await civilityScoreService.getModerationWeight(userId);
  
  console.log(`User ${userId} has moderation weight of ${weight}`);
  
  // Higher weights mean more influence on moderation decisions
  return weight;
}
```

### Determining Content Visibility

```javascript
const civilityScoreService = require('./CivilityScoreService');

async function calculateContentRankingAdjustment(userId, baseRankingScore) {
  // Get visibility multiplier based on user's civility score
  const multiplier = await civilityScoreService.getVisibilityMultiplier(userId);
  
  // Apply to base ranking score
  const adjustedScore = baseRankingScore * multiplier;
  
  console.log(`Content ranking adjusted from ${baseRankingScore} to ${adjustedScore}`);
  return adjustedScore;
}
```

### Handling Score Recovery

```javascript
const civilityScoreService = require('./CivilityScoreService');

async function getRecoveryPath(userId) {
  // Get recovery requirements for a user with low civility score
  const requirements = await civilityScoreService.getRestorationRequirements(userId);
  
  if (!requirements.requiresRestoration) {
    console.log(`User ${userId} has good standing with score ${requirements.currentScore}`);
    return null;
  }
  
  console.log(`User needs to improve score by ${requirements.deficit} to reach neutral standing`);
  console.log(`Options to improve: ${requirements.positiveActionsNeeded.constructiveComments} constructive comments`);
  console.log(`Or: ${requirements.positiveActionsNeeded.qualityPosts} quality posts`);
  console.log(`Or: ${requirements.positiveActionsNeeded.timeToNaturalRecovery} days of good behavior`);
  
  return requirements;
}
```

## Configuration

The Civility Score system is configured through the central moderation configuration file (`config/moderation.config.js`). Key configuration options include:

- Initial score values for new users
- Action weights for different behaviors
- Recovery and decay rates
- Score tier thresholds
- User tier multipliers

## Performance Considerations

The Civility Score system is designed for high performance:

- Score calculations use simple arithmetic operations
- Caching is employed for frequently accessed scores
- Time-based adjustments are calculated only when scores are accessed
- Batch processing of score updates for system-wide actions

## Security Considerations

- Score adjustments should be protected from manipulation
- Administrative overrides should be logged and audited
- Score history should be maintained for transparency
- Anti-gaming measures should detect coordinated manipulation

## Monitoring and Analytics

The system tracks key metrics:

- Overall score distribution across user base
- Tier transition rates (improvement vs. decline)
- Action impact analysis
- Recovery success rates
- Correlation between civility and content quality

## Related Components

- Content Moderation System
- Community Voting System
- User Reputation System
- Content Ranking Algorithm
- User Profile System

## Contributing

When extending the Civility Score system:

1. Ensure new action types have appropriate weights
2. Document the reasoning behind weight values
3. Test impacts on score distribution
4. Maintain the balance between strictness and forgiveness
## License and Usage Terms

CivIQ Platform - A civic discourse platform designed to foster meaningful, evidence-based discussions

Copyright (C) 2025 CivIQ Platform

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version, with the additional terms of
CivIQ's Mission-Aligned Usage Clauses.

**MISSION-ALIGNED USAGE:** This software may only be used for civic engagement,
misinformation prevention, educational research, and transparency initiatives.
Usage for profit-driven social media, misinformation, censorship, surveillance,
or commercial purposes is expressly prohibited.

The complete license terms, including the Mission-Aligned Usage Clauses,
can be found in the [LICENSE.md](LICENSE.md) file at the root of this repository.
