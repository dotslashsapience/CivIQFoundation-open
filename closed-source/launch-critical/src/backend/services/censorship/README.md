# CivIQ Censorship Resistance Service

This directory contains the launch-critical censorship resistance systems for CivIQ, designed to ensure platform resilience against takedowns, censorship, and manipulation.

## Core Mission

To create a censorship-resistant platform that remains accessible and operational regardless of external pressures, while maintaining high performance and user experience.

## Key Features

- **Decentralized Hosting Infrastructure**: Multi-layered hosting approach with both edge servers and decentralized storage
- **Alternative Access Points**: Tor (.onion), I2P (.i2p), and mirror sites ensuring continued accessibility
- **Blockchain Domains**: ENS/Handshake integration to prevent DNS-level takedowns
- **Content Persistence**: IPFS and Arweave integration for immutable content storage
- **Data Portability**: Easy export and backup mechanisms for all user content
- **Hybrid Architecture**: Balances performance needs with censorship resistance principles

## Module Structure

```
/censorship/
├── arweave/          - Permanent content storage on Arweave blockchain
├── backups/          - Automated backup systems for all platform content
├── decentralizedHosting/  - Core infrastructure for distributed hosting
├── ens/              - Ethereum Name Service domain integration
├── handshake/        - Handshake domain name system integration
├── i2p/              - Invisible Internet Project network integration
├── ipfs/             - InterPlanetary File System content distribution
├── mirrorSites/      - Mirror site deployment and synchronization
└── tor/              - Tor hidden service implementation
```

## Getting Started

### Prerequisites

- Node.js 18+
- IPFS daemon (v0.14.0+)
- Arweave wallet with AR tokens
- Access to ENS/Handshake registration services
- Tor and I2P router installations

### Installation

```bash
# Install dependencies for all censorship resistance modules
npm install --prefix src/backend/services/censorship

# Configure your environment variables
cp .env.example .env
```

Edit the `.env` file with your specific configuration for IPFS nodes, Arweave wallets, and other services.

### Configuration

The main configuration file is at `config/censorship.config.js`. This defines:

- Primary and backup storage providers
- Replication strategies
- Threshold for content backup
- Mirror site deployment specifications
- Network service endpoints

## Architecture

### Decentralized Hosting Model

The system uses a hybrid approach:
1. **Edge Servers**: For performance and initial content delivery
2. **IPFS Nodes**: For distributed content availability
3. **Arweave**: For permanent, immutable content storage
4. **Mirror Sites**: Automated replication to multiple jurisdictions

### Content Flow

1. Content is created and stored on primary servers
2. Immediately replicated to IPFS network with multiple pins
3. Critical content archived to Arweave blockchain
4. Content hashes registered with ENS/Handshake for discovery
5. Mirror sites continuously sync content from primary sources
6. Alternative routing (Tor/I2P) automatically updated

## Implementation Guide

To implement a new feature in the censorship resistance system:

1. All content models must implement the `ICensorshipResistant` interface
2. Use the BackupService for any content that should persist
3. Register important domains with both ENS and Handshake
4. Ensure content hashes are properly indexed and discoverable
5. Test access via all alternative routing networks

## Monitoring and Maintenance

The system includes monitoring for:
- IPFS node health and connectivity
- Arweave transaction confirmations
- Mirror site synchronization status
- DNS resolution across multiple providers
- Tor and I2P service availability

## Security Considerations

- Private keys for blockchain services must use the secure KeyManagement service
- All mirror site deployments must use hardened configurations
- Regular audits of access patterns to detect blocking attempts
- Geographic distribution must span at least 3 legal jurisdictions

## Related Services

- Identity Protection Service
- Content Storage Service
- Payment Processing Services

## Contributing

See our [Contribution Guidelines](../../../CONTRIBUTING.md) for information on how to contribute to this critical system.


## License

This component is licensed under the GNU Affero General Public License Version 3 (AGPL-3.0), the same license used for the overall CivIQ Platform. The AGPL-3.0 license ensures that the source code remains open and available to all users, even when the platform is being provided as a service over a network.

For more details, see the [LICENSE.md](../../../../../LICENSE.md) file in the project root.

Copyright © 2025 CivIQ Platform
