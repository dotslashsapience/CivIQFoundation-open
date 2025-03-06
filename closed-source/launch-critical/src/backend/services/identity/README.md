# CivIQ Identity & Verification Service

This directory contains the launch-critical identity verification and privacy protection systems for CivIQ, designed to ensure all users are real people while protecting high-risk users.

## Core Mission

To provide robust identity verification while maintaining appropriate privacy protections, ensuring "one-person-one-account" without compromising the safety of journalists, activists, and whistleblowers.

## Key Features

- **Multi-Method Verification**: Support for various identity verification approaches
- **Pseudonymity Support**: Allows verified users to maintain public pseudonyms
- **Cryptographic Privacy**: Zero-knowledge proofs for sensitive verification
- **High-Risk User Protection**: Enhanced privacy options for at-risk individuals
- **Web of Trust Model**: Decentralized verification through trusted connections
- **Appeals System**: Process for addressing verification challenges

## Module Structure

```
/identity/
├── anonymity/         - Privacy-enhancing tools for high-risk users
├── appeals/           - Systems for verification dispute resolution
├── cryptographic/     - Zero-knowledge proof implementations
├── federated/         - Integration with external identity providers
├── privacy/           - Core privacy protection mechanisms
├── verification/      - Primary verification service implementation
└── webOfTrust/        - Social graph-based verification methods
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Hardware security module (recommended for production)

### Installation

```bash
# Install dependencies for all identity modules
npm install --prefix src/backend/services/identity

# Configure your environment variables
cp .env.example .env
```

Edit the `.env` file with your specific configuration for database connections, encryption keys, and external services.

### Configuration

The main configuration file is at `config/identity.config.js`. This defines:

- Verification methods and their weights
- Privacy thresholds and protections
- Appeal review thresholds
- Web of trust rules and requirements
- Anti-bot detection parameters

## Architecture

### Verification Model

The system uses a layered approach to verification:

1. **Basic Verification**: Email/phone verification and basic anti-bot checks
2. **Cryptographic Identity**: Proof of unique device and cryptographic signatures
3. **Social Verification**: Web of trust and connection-based verification
4. **Enhanced Verification**: Optional stronger verification for special privileges

### Privacy Model

Privacy protections scale based on user needs:

1. **Standard Users**: Basic privacy with identity verification
2. **At-Risk Users**: Enhanced privacy with pseudonymous profiles
3. **High-Risk Users**: Maximum privacy with special protections

## Implementation Guide

To implement identity-related features:

1. All user entities must implement the `IVerifiable` interface
2. Use the `IdentityService` for all verification operations
3. Always check both `isVerified` and `verificationLevel` attributes
4. Use `PrivacyManager` to handle sensitive user data
5. Implement rate limiting on all verification endpoints

### Verification Process Implementation

```javascript
// Example verification process
const verifyUser = async (userId, verificationData) => {
  const userService = new IdentityService();
  
  // Process verification with appropriate method
  const result = await userService.verify(userId, {
    method: verificationData.method,
    proofData: verificationData.proof,
    requestedPrivacyLevel: verificationData.privacyLevel
  });
  
  // Handle verification status
  if (result.verified) {
    await userService.updateVerificationStatus(userId, result);
    return result;
  } else {
    // Initiate appeals process if needed
    if (result.eligibleForAppeal) {
      await appealService.createAppeal(userId, result.failureReason);
    }
    return result;
  }
};
```

## Security Considerations

- All verification data must be encrypted at rest and in transit
- Verification proofs should be stored separately from user data
- Privacy settings must be checked before revealing user information
- High-risk user protection requires additional rate limiting
- Regular security audits of the verification process

## Monitoring and Alerts

The system includes monitoring for:
- Unusual verification patterns
- Geographic anomalies in verification attempts
- Batch verification attempts
- Verification method effectiveness
- Privacy rule impacts

## Related Services

- Bot Detection Service
- Moderation System
- Content Storage Service
- Community Trust System

## Contributing

See our [Contribution Guidelines](../../../CONTRIBUTING.md) for information on how to contribute to this critical system.


## License

This component is licensed under the GNU Affero General Public License Version 3 (AGPL-3.0), the same license used for the overall CivIQ Platform. The AGPL-3.0 license ensures that the source code remains open and available to all users, even when the platform is being provided as a service over a network.

For more details, see the [LICENSE.md](../../../../../LICENSE.md) file in the project root.

Copyright © 2025 CivIQ Platform
