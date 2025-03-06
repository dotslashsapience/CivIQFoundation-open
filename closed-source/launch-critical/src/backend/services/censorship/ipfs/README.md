# CivIQ IPFS Integration

This directory contains the implementation of CivIQ's IPFS (InterPlanetary File System) integration, a core component of the platform's censorship resistance strategy.

## Overview

The IPFS module provides decentralized content storage and distribution capabilities, ensuring that CivIQ content remains accessible even if traditional hosting infrastructure is compromised or censored.

## Key Features

- **Content Persistence**: Store content in a distributed network that cannot be easily censored
- **Multi-Node Pinning**: Ensure content remains available through multiple pinning services
- **Content Addressing**: Use of cryptographic content IDs for tamper-proof content verification
- **Gateway Integration**: Access content through multiple gateway options for redundancy
- **Service Monitoring**: Continuous monitoring of IPFS node health and content availability

## Component Architecture

```
/ipfs/
├── IPFSService.js           - Core service for IPFS interaction
├── PinningService.js        - Service for pinning content to remote nodes
├── ContentTracker.js        - Tracks content stored on IPFS
├── GatewayManager.js        - Manages multiple gateway access points
├── MonitoringService.js     - Monitors IPFS network health
└── interfaces/              - TypeScript interfaces for IPFS components
```

## Implementation Details

### IPFSService

The `IPFSService` is the main entry point for IPFS interactions. It provides a simplified interface for:

- Adding content to IPFS
- Retrieving content from IPFS
- Pinning content for persistence
- Checking content availability
- Getting gateway URLs

### PinningService

The `PinningService` handles interactions with remote pinning services, ensuring content is distributed across multiple nodes for redundancy. Supported services include:

- Pinata
- Infura IPFS
- Custom pinning endpoints

### Content Flow

1. Content is created or updated in the CivIQ system
2. The content is added to IPFS via the `IPFSService`
3. The resulting Content Identifier (CID) is stored in the CivIQ database
4. The content is pinned to multiple pinning services for redundancy
5. The content can be accessed via IPFS gateways using the CID

## Usage Examples

### Storing Content on IPFS

```javascript
const ipfsService = require('./IPFSService');

// Store a text post
const result = await ipfsService.addContent('This is a post that cannot be censored', {
  contentType: 'text/plain',
  name: 'uncensorable-post.txt',
  contentId: 'post-123'
});

console.log(`Content stored on IPFS with CID: ${result.cid}`);
console.log(`Access URL: ${result.gateway}`);

// Store JSON data
const jsonResult = await ipfsService.addContent({
  title: 'Uncensorable JSON',
  content: 'This JSON object is stored on IPFS',
  timestamp: new Date().toISOString()
}, {
  contentType: 'application/json',
  contentId: 'json-456'
});

// Store a file buffer (e.g., an image)
const fileBuffer = fs.readFileSync('/path/to/image.jpg');
const imageResult = await ipfsService.addContent(fileBuffer, {
  contentType: 'image/jpeg',
  name: 'uncensorable-image.jpg',
  contentId: 'image-789'
});
```

### Retrieving Content from IPFS

```javascript
const ipfsService = require('./IPFSService');

// Get content by CID
const content = await ipfsService.getContent('QmXyZ123...');
console.log(content.toString()); // For text content

// Check if content is available
const isAvailable = await ipfsService.isContentAvailable('QmXyZ123...');
if (isAvailable) {
  console.log('Content is available on IPFS');
} else {
  console.log('Content is not currently available');
}

// Get a gateway URL for browser access
const gatewayUrl = ipfsService.getGatewayUrl('QmXyZ123...');
console.log(`Access via gateway: ${gatewayUrl}`);
```

## Configuration

The IPFS module is configured through the central censorship configuration file (`config/censorship.config.js`). Key configuration options include:

- IPFS node connection details
- Pinning service credentials
- Gateway URLs
- Content persistence policies
- Redundancy requirements

## Monitoring and Maintenance

The IPFS module includes monitoring capabilities to ensure the health of the IPFS integration:

- Regular checks of IPFS node connectivity
- Verification of pinned content availability
- Pinning service health checks
- Automatic recovery of lost pins

## Performance Considerations

IPFS operations can be slow, especially when adding new content to the network. The module implements several optimizations:

- Caching of frequently accessed content
- Parallel pinning operations
- Timeout handling with automatic retries
- Prioritization of critical content

## Security Considerations

- All IPFS interactions should be monitored for unusual patterns
- Pinning service credentials must be securely stored
- Content should be verified using cryptographic hashes
- Public gateways should be regularly rotated for censorship resistance

## Related Components

- Arweave integration for permanent content storage
- ENS/Handshake integration for decentralized naming
- Tor/I2P integration for anonymous access
- Content Backup System for automatic replication

## Contributing

When extending the IPFS integration:

1. Follow the existing patterns for error handling and logging
2. Add comprehensive tests for new functionality
3. Document any new configuration options
4. Ensure backward compatibility with existing content

## Resources

- [IPFS Documentation](https://docs.ipfs.io/)
- [js-ipfs API Reference](https://github.com/ipfs/js-ipfs/tree/master/docs/core-api)
- [Pinata API Documentation](https://docs.pinata.cloud/)
- [Infura IPFS Documentation](https://infura.io/docs/ipfs)
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
