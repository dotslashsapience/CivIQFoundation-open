# CivIQ Content Service

This directory contains the implementation of CivIQ's content management system, a launch-critical component that handles the storage, retrieval, and management of user-generated content with built-in censorship resistance.

## Core Mission

To provide a robust, censorship-resistant content management system that supports various content types while ensuring availability, integrity, and persistence across decentralized storage networks.

## Key Features

- **Multi-Format Content Support**: Text posts, long-form articles, images, videos
- **Decentralized Storage**: Primary storage with decentralized backups (IPFS, Arweave)
- **Content Portability**: Export and migration capabilities for all content
- **Versioning**: Content history tracking for transparency
- **Metadata Management**: Rich metadata for discovery and organization
- **Access Control**: Granular permissions while maintaining censorship resistance
- **Content Integrity**: Cryptographic verification of content authenticity

## Module Structure

```
/content/
├── arweave/          - Arweave blockchain storage integration
├── conventional/     - Traditional database storage
├── ipfs/             - IPFS storage integration
├── longForm/         - Long-form article handling
├── media/            - Image and video content handling
├── storage/          - Core storage abstraction layer
└── textPosts/        - Short-form text content handling
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- IPFS node (v0.14.0+)
- Arweave wallet with AR tokens
- S3-compatible object storage (optional)

### Installation

```bash
# Install dependencies for all content modules
npm install --prefix src/backend/services/content

# Configure your environment variables
cp .env.example .env
```

Edit the `.env` file with your specific configuration for storage providers and APIs.

### Configuration

The main configuration is split between service-specific and global settings:

1. **Service Configuration**: `src/backend/services/content/config.js`
2. **Global Storage Configuration**: `config/censorship.config.js`

These define:

- Storage provider hierarchy and fallbacks
- Content type handling rules
- Backup frequency and thresholds
- Replication strategies
- Transformation settings

## Architecture

### Content Flow

Content moves through the system in a multi-stage process:

1. **Creation**: Content created through the API
2. **Processing**: Content validated, transformed, and prepared for storage
3. **Primary Storage**: Content stored in the primary database
4. **Decentralized Backup**: Content mirrored to decentralized storage
5. **Permanent Archive**: Critical content archived to immutable storage
6. **Retrieval**: Content served from the fastest available source
7. **Fallback**: Automatic failover to alternative sources if primary fails

### Storage Strategy

The storage strategy employs a hybrid approach:

1. **Conventional Storage**: Primary storage for performance and indexing
2. **IPFS Network**: Distributed content availability with multiple pins
3. **Arweave Blockchain**: Permanent, immutable storage for critical content
4. **Geographic Distribution**: Content replicated across multiple jurisdictions

## Implementation Guide

To implement content-related features:

1. All content must implement the `IPortableContent` interface
2. Use the `StorageService` for all content operations
3. Include content hashes for verification in all metadata
4. Implement automatic backups via the BackupScheduler
5. Use appropriate content type handlers for specialized formats

### Content Creation Implementation

```javascript
// Example content creation process
const createContent = async (userId, contentData, options = {}) => {
  const contentService = new ContentService();
  
  // Determine content type handler
  const contentHandler = contentService.getHandlerForType(contentData.type);
  
  // Process and validate content
  const processedContent = await contentHandler.process(contentData);
  
  // Store content with appropriate persistence level
  const persistenceLevel = options.persistence || 'standard';
  const storageResult = await contentService.store(
    processedContent, 
    userId,
    { persistenceLevel }
  );
  
  // For high-importance content, trigger immediate backup
  if (persistenceLevel === 'critical') {
    await contentService.backup.scheduleImmediate(storageResult.contentId);
  }
  
  return {
    contentId: storageResult.contentId,
    status: 'created',
    timestamps: storageResult.timestamps,
    accessMethods: storageResult.accessMethods
  };
};
```

## Security Considerations

- All content must be validated before storage to prevent injection attacks
- Media content should be scanned for malware and sanitized
- Content access controls must be enforced consistently
- Metadata must be protected from tampering
- Sensitive content must be properly encrypted when needed
- Storage credentials must be securely managed

## Performance Considerations

Content delivery is optimized for performance:

- CDN integration for popular content
- Caching strategy for frequently accessed content
- Progressive loading for large media files
- Content transformation for different client capabilities
- Response compression for bandwidth efficiency

## Related Services

- Censorship Resistance Service
- Moderation Service
- Feed Service
- Search Service

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
