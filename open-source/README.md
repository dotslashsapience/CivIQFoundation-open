# CivIQ Platform (Open Source)

A censorship-resistant civic discourse platform designed to foster high-quality discussion, ensure real identity verification, and prevent manipulation. This repository contains the open source components of the CivIQ platform.

## 🌟 Open Source Components

This repository contains:

- **Frontend UI** - Complete user interface components
- **Public API Documentation** - Comprehensive API documentation
- **Design Guidelines & UX Components** - Design system and UX patterns
- **User Profiles** - Basic profile management 
- **Content Storage (Non-algorithmic)** - Base content storage functionality
- **Messaging System** - Core messaging capabilities
- **Localization & Accessibility Features** - i18n and a11y implementations

The repository is organized into:
- `launch-critical/` - Essential components needed for initial platform launch
- `post-launch/` - Components planned for implementation after initial launch

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- IPFS daemon (for local development)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/civiq-open-source.git
cd civiq-open-source

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your specific settings

# Start development environment
npm run dev
```

## 📄 License

CivIQ Platform is licensed under the **GNU Affero General Public License Version 3 (AGPL-3.0) with Mission-Aligned Usage Clauses**. 

This license ensures that:
- The source code remains open and available to all users, even when provided as a service
- Derivative works **must** align with CivIQ's civic engagement mission
- Usage is **restricted to permitted use cases**: civic engagement, misinformation prevention, educational research, and transparency initiatives
- Usage for profit-driven social media, misinformation spread, censorship, surveillance, or commercial purposes is **expressly prohibited**

For complete details, see [LICENSE.md](LICENSE.md)

Copyright © 2025 CivIQ Platform