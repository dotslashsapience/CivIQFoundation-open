# CivIQ Platform - Repository Structure

This directory contains the reorganized CivIQ platform codebase, separated into open source and closed source components, each with launch-critical and post-launch features properly segregated.

## Directory Structure

The codebase is organized into two main repositories:

1. **Open Source** (`open-source/`) - Publicly available components including:
   - Frontend UI
   - Public API Documentation
   - User Profiles
   - Content Storage (non-algorithmic)
   - Messaging System

2. **Closed Source** (`closed-source/`) - Proprietary components including:
   - Ranking Algorithm
   - Moderation Tools
   - Bot Detection
   - Identity Verification
   - Censorship Resistance Infrastructure

**All features of the platform will be open-sourced at deployment**

Each repository is further divided into:
- `launch-critical/` - Essential components needed for initial platform launch
- `post-launch/` - Components planned for implementation after initial launch

For a detailed breakdown of the directory structure, see [REPOSITORY-STRUCTURE.md](REPOSITORY-STRUCTURE.md).

## Getting Started

### Setting Up Repositories

1. **Initialize Git Repositories**
   ```bash
   # Open Source Repository
   cd open-source
   git init
   git add .
   git commit -m "Initial commit of open source components"
   
   # Closed Source Repository
   cd ../closed-source
   git init
   git add .
   git commit -m "Initial commit of closed source components"
   ```

2. **Add Remote Repositories**
   ```bash
   # Open Source Repository
   cd open-source
   git remote add origin https://github.com/your-org/civiq-open-source.git
   git push -u origin main
   
   # Closed Source Repository
   cd ../closed-source
   git remote add origin https://github.com/your-org/civiq-closed-source.git
   git push -u origin main
   ```

### Integration

For details on how to integrate the open-source and closed-source components, see [INTEGRATING-REPOSITORIES.md](INTEGRATING-REPOSITORIES.md).

## License

- **Open Source Components**: GNU Affero General Public License v3.0 (AGPL-3.0)
- **Closed Source Components**: All rights reserved, proprietary and confidential

## Next Steps

1. Review the repository structure
2. Complete shared interfaces for integration
3. Implement feature flags for optional closed-source functionality
4. Set up CI/CD workflows for both repositories
5. Create contributing guidelines for the open-source repository