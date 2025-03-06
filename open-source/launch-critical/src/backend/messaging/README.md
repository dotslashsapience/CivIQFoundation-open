# CivIQ Messaging Service

This directory contains the implementation of CivIQ's secure messaging system, a launch-critical component that enables private, encrypted communications between users.

## Core Mission

To provide robust, private, and censorship-resistant messaging capabilities for the CivIQ platform, ensuring that users can communicate securely without fear of surveillance or interception.

## Key Features

- **End-to-End Encryption**: All messages encrypted using strong cryptography
- **Message Storage**: Secure storage with encryption at rest
- **Ephemeral Messaging**: Auto-disappearing messages for sensitive communications
- **Group Messaging**: Secure group conversations with proper key management
- **Moderation Tools**: Limited content moderation for abuse prevention
- **Notifications**: Message delivery notifications without compromising privacy
- **Metadata Protection**: Minimized metadata collection and storage

## Module Structure

```
/messaging/
├── core/            - Core messaging functionality
├── encryption/      - Cryptographic implementation
├── ephemeral/       - Self-destructing message handling
├── groups/          - Group messaging implementation
├── moderation/      - Limited abuse prevention tools
├── notifications/   - Message delivery notifications
└── storage/         - Secure message persistence
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+ (for ephemeral messages)
- Web Crypto API support

### Installation

```bash
# Install dependencies for all messaging modules
npm install --prefix src/backend/services/messaging

# Configure your environment variables
cp .env.example .env
```

Edit the `.env` file with your specific configuration for databases, encryption parameters, and storage settings.

### Configuration

The main configuration is managed through:

1. **Service Configuration**: `src/backend/services/messaging/config.js`
2. **Security Settings**: `config/security.config.js`

These define:

- Encryption algorithms and key sizes
- Message retention policies
- Rate limiting parameters
- Notification settings
- Moderation thresholds

## Architecture

### Messaging Flow

Messages follow a secure path through the system:

1. **Composition**: User composes message through client interface
2. **Local Encryption**: Message encrypted on client device with recipient's public key
3. **Transmission**: Encrypted message sent to server
4. **Storage**: Encrypted message stored (cannot be decrypted by server)
5. **Notification**: Recipient notified of new message
6. **Retrieval**: Recipient fetches encrypted message
7. **Local Decryption**: Message decrypted on recipient's device

### Encryption Strategy

The encryption strategy employs multiple layers:

1. **Transport Layer Security**: TLS for all API communications
2. **End-to-End Encryption**: Signal Protocol or similar for message content
3. **Forward Secrecy**: Regular key rotation to protect future communications
4. **Deniable Authentication**: OTR-style deniability for sensitive communications
5. **Key Verification**: Methods to verify communication partner identity

## Implementation Guide

To implement messaging-related features:

1. All messages must use the `IEncryptedMessage` interface
2. Use the `EncryptionService` for all cryptographic operations
3. Implement appropriate key management with the `KeyManager`
4. Use ephemeral messaging mode for sensitive communications
5. Implement minimal metadata storage for security

### Message Sending Implementation

```javascript
// Example message sending process
const sendMessage = async (senderId, recipientId, messageData, options = {}) => {
  const messagingService = new MessagingService();
  
  // Get recipient's public key
  const recipientKey = await messagingService.keyManager.getPublicKey(recipientId);
  
  // Create message object
  const message = {
    content: messageData.content,
    metadata: {
      timestamp: new Date().toISOString(),
      ephemeral: options.ephemeral || false,
      expirationTime: options.ephemeral ? Date.now() + options.ttl : null
    }
  };
  
  // Encrypt message for recipient
  const encryptedMessage = await messagingService.encryption.encryptMessage(
    message,
    recipientKey
  );
  
  // Store encrypted message
  const messageId = await messagingService.storage.storeMessage(
    senderId,
    recipientId,
    encryptedMessage,
    options
  );
  
  // Send notification to recipient
  await messagingService.notifications.notifyNewMessage(recipientId, {
    senderId,
    messageId,
    type: 'new_message'
  });
  
  return {
    messageId,
    status: 'sent',
    timestamp: message.metadata.timestamp
  };
};
```

## Security Considerations

- Encryption keys must never leave the client device
- Messages must be encrypted end-to-end, not just in transit
- Metadata minimization to protect communication patterns
- Rate limiting to prevent abuse and spam
- Message storage must be secured and encrypted
- All cryptographic implementations must be regularly audited
- No backdoors or key escrow mechanisms

## Privacy Protections

The messaging system includes specific privacy protections:

- No content scanning or message analysis
- Limited metadata collection and storage
- No permanent message history (unless explicitly requested)
- No third-party access to message content
- User control over message retention

## Related Services

- Identity Service
- Moderation Service
- Notification Service
- Security Service

## Contributing

See our [Contribution Guidelines](../../../CONTRIBUTING.md) for information on how to contribute to this critical system.

## License

This component is licensed under the same terms as the overall CivIQ platform.
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
