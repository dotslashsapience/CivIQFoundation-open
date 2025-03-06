# CivIQ Bot Detection & Prevention Service

This directory contains the launch-critical bot detection and prevention systems for CivIQ, designed to ensure authentic human-to-human discourse on the platform.

## Core Mission

To create a robust, adaptive system that prevents automated accounts and coordinated inauthentic behavior while minimizing false positives and providing transparent appeals processes.

## Key Features

- **Behavioral Analysis**: Detection of non-human interaction patterns
- **Brigading Prevention**: Identification of coordinated manipulation attempts
- **One-Person-One-Account**: Enforcement of unique human identity policy
- **Verification Challenges**: Adaptive, risk-based verification methods
- **Appeals Process**: Fair resolution for false positive detections
- **Transparent Metrics**: Clear reporting on bot detection systems

## Module Structure

```
/botDetection/
├── appeals/           - Appeals process for false positive detections
├── behaviorAnalysis/  - User behavior monitoring and analysis
├── brigading/         - Coordinated behavior detection systems
├── detection/         - Core bot detection algorithms and implementation
├── metrics/           - Reporting and performance measurement
├── prevention/        - Proactive bot prevention mechanisms
└── verification/      - Human verification challenge systems
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+ (for rate limiting and pattern detection)
- ML pipeline with TensorFlow or PyTorch (for behavior analysis)

### Installation

```bash
# Install dependencies for all bot detection modules
npm install --prefix src/backend/services/botDetection

# Configure your environment variables
cp .env.example .env
```

Edit the `.env` file with your specific configuration for databases, machine learning services, and detection thresholds.

### Configuration

The main configuration file is at `config/botDetection.config.js`. This defines:

- Detection sensitivity thresholds
- Verification challenge frequency and difficulty
- Appeals process parameters
- Behavioral pattern definitions
- Rate limiting specifications

## Architecture

### Detection Layers

The system employs multiple detection layers:

1. **Registration Security**: Initial verification and proof-of-humanity
2. **Behavioral Analysis**: Ongoing monitoring of interaction patterns
3. **Activity Monitoring**: Detection of non-human usage patterns
4. **Collective Intelligence**: Group behavior and coordination detection
5. **Risk-Based Challenges**: Adaptive verification based on risk scoring

### Prevention Strategy

The prevention strategy combines proactive and reactive measures:

1. **Proactive Barriers**: Verification challenges and proof-of-humanity requirements
2. **Continuous Monitoring**: Ongoing analysis of user behavior patterns
3. **Response Scaling**: Risk-based response proportional to confidence level
4. **Appeal Mechanisms**: Correction of false positives through appeals
5. **Learning System**: Continuous improvement through feedback loops

## Implementation Guide

To implement bot detection features:

1. Use the `BotDetectionService` for all detection operations
2. Implement verification at critical user journey points
3. Apply risk-based rules for enhanced verification
4. Collect behavioral telemetry through the `BehaviorAnalysisService`
5. Process appeals through the established appeals pipeline

### Bot Detection Implementation

```javascript
// Example bot detection process
const checkUserActivity = async (userId, activityData) => {
  const detectionService = new BotDetectionService();
  
  // Process activity through detection pipeline
  const riskAssessment = await detectionService.analyzeActivity(userId, {
    activityType: activityData.type,
    activityContent: activityData.content,
    contextualData: activityData.context
  });
  
  // Handle detection result based on risk level
  if (riskAssessment.riskLevel > detectionService.THRESHOLDS.HIGH_RISK) {
    // High risk - immediate action required
    await detectionService.initiateVerificationChallenge(userId, {
      challengeLevel: 'high',
      reason: riskAssessment.primarySignals
    });
  } else if (riskAssessment.riskLevel > detectionService.THRESHOLDS.MEDIUM_RISK) {
    // Medium risk - monitor more closely
    await detectionService.enhanceMonitoring(userId);
  }
  
  return riskAssessment;
};
```

## Quality Metrics and Monitoring

The system tracks key performance indicators:

- False positive and false negative rates
- Appeal rates and resolution outcomes
- Bot prevention effectiveness
- User friction metrics
- Detection coverage across user activities
- Brigading and coordination detection success

## Security Considerations

- Detection algorithms must be resistant to adversarial analysis
- Appeal systems must prevent abuse while resolving false positives
- Verification challenges should adapt to changing bot techniques
- All detection signals must have calibrated confidence scores
- Privacy considerations must be balanced with detection needs

## Related Services

- Identity Verification Service
- Moderation Service
- Algorithm & Ranking Service
- Security Service

## Contributing

See our [Contribution Guidelines](../../../CONTRIBUTING.md) for information on how to contribute to this critical system.


## License

This component is licensed under the GNU Affero General Public License Version 3 (AGPL-3.0), the same license used for the overall CivIQ Platform. The AGPL-3.0 license ensures that the source code remains open and available to all users, even when the platform is being provided as a service over a network.

For more details, see the [LICENSE.md](../../../../../LICENSE.md) file in the project root.

Copyright © 2025 CivIQ Platform
