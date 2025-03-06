# CivIQ Launch-Critical Components

This document lists all the components that are considered **LAUNCH-CRITICAL** for the CivIQ platform. These components must be prioritized during development and must be fully functional for the initial platform launch.

## Backend Services

- **Algorithm** - Content ranking system that prioritizes quality discourse
  - Credibility weighting
  - Constructive engagement scoring 
  - Time decay factors
  - Viewpoint diversity mechanisms
  - Transparency in ranking

- **Bot Detection** - Systems to identify and prevent automated accounts
  - Behavioral analysis
  - Brigading prevention
  - Verification challenges
  - Appeals process

- **Censorship Resistance** - Features for platform resilience
  - IPFS/Arweave integration
  - Tor (.onion) access
  - I2P (.i2p) access
  - ENS/Handshake domains
  - Decentralized hosting infrastructure

- **Community Moderation** - User-powered moderation
  - Voting mechanisms
  - Reputation-weighted influence
  - Appeals process
  - Delegation system

- **Content** - Post storage and management
  - Text posts
  - Long-form articles
  - Media (images, video)
  - Decentralized storage and backups

- **Feed** - Content delivery system
  - Algorithm-driven ranking
  - Quality-focused (not engagement-focused)
  - Viewpoint diversity
  - No user configuration options

- **Identity** - User verification
  - Multiple verification methods
  - Privacy protections for high-risk users
  - Mandatory profile information
  - Appeal mechanisms

- **Messaging** - Secure communications
  - End-to-end encryption
  - Optional ephemeral messaging
  - Decentralized storage

- **Moderation** - Content review system
  - AI-assisted first pass
  - Human review
  - Civility score system
  - Rules enforcement

- **Payments** - Financial infrastructure
  - BTC, Monero, Ethereum support
  - Self-hosted BTCPayServer
  - Donation framework
  - Subscription management

- **Profiles** - User information
  - Required profile photos
  - Bios and verification badges
  - Data portability
  - Privacy controls

- **Web of Trust** - Social verification
  - Identity verification without government ID
  - Trust graph algorithms
  - Reputation scoring

## Frontend Components

- **Core UI** - Essential user interface
  - Feed view
  - Content creation
  - Comments and discussions
  - Moderation tools
  - User profiles

## Infrastructure

- **Deployment** - Multi-jurisdiction hosting
  - Docker containerization
  - Kubernetes orchestration
  - Self-hosted infrastructure
  - Geographic distribution

## Development Priorities

1. **Complete core functionality first** - Ensure all launch-critical components are working
2. **Security and privacy** - Implement robust security measures from the start
3. **Censorship resistance** - Build in resistance to takedowns and censorship
4. **Performance** - Ensure acceptable performance under expected load
5. **Testing** - Comprehensive test coverage for all launch-critical components

## Post-Launch Features

Features not listed in this document are considered post-launch and should be implemented after the initial platform release. These features have been moved to the `post_launch_features_backup` directory for future development.