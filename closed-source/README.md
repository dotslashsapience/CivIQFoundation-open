# CivIQ Platform (Closed Source Components)

This repository contains the closed-source components of the CivIQ platform, including:

## 🔒 Closed Source Components

- **Ranking Algorithm** - Content visibility and prioritization
- **Moderation Tools** - Misinformation detection and user behavior analysis
- **Bot Detection & Prevention Models** - Automated account prevention
- **Identity Verification** - One-person-one-account system
- **Security & Anti-Exploitation Protections** - Platform security measures
- **Censorship Resistance Infrastructure** - Backup and resiliency mechanisms

The repository is organized into:
- `launch-critical/` - Essential components needed for initial platform launch
- `post-launch/` - Components planned for implementation after initial launch

## 🚀 Development

This repository is private and requires proper authentication to access. It is designed to integrate with the open-source CivIQ components.

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- IPFS daemon (for local development)
- Access to the CivIQ open-source repository

### Installation

```bash
# Clone both repositories
git clone https://github.com/your-org/civiq-open-source.git
git clone https://github.com/your-org/civiq-closed-source.git

# Install dependencies
cd civiq-closed-source
npm install
```

## Integration

This repository integrates with the open-source components through shared interfaces. See `INTEGRATING-REPOSITORIES.md` in the root directory for instructions on how to integrate these components.

## 📄 License

All rights reserved. This code is proprietary and confidential.

Copyright © 2025 CivIQ Platform