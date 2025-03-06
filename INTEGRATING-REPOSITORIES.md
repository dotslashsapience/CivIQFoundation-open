# Integrating CivIQ Open and Closed Source Components

This guide explains how to work with both the open-source and closed-source components of CivIQ.

## Repository Structure

The CivIQ platform is now split into two repositories:

1. `civiq-open-source`: Contains all openly available components including:
   - Frontend UI
   - Public API Documentation
   - Design Guidelines & UX Components
   - User Profiles & Non-Sensitive Data Storage
   - Basic Messaging
   - Content Storage (non-algorithmic parts)

2. `civiq-closed-source`: Contains proprietary components including:
   - Ranking Algorithm
   - Moderation Tools
   - Bot Detection
   - Identity Verification
   - Security Components
   - Censorship Resistance Infrastructure

## Development Setup

### Option 1: Using Both Repositories Side-by-Side

1. Clone both repositories into adjacent directories:
   ```bash
   git clone https://github.com/your-org/civiq-open-source.git
   git clone https://github.com/your-org/civiq-closed-source.git
   ```

2. Install dependencies in both repositories:
   ```bash
   # In civiq-open-source directory
   cd civiq-open-source
   npm install

   # In civiq-closed-source directory
   cd ../civiq-closed-source
   npm install
   ```

3. The closed-source package.json references the open-source package locally:
   ```json
   "dependencies": {
     "civiq-open-source": "file:../civiq-open-source",
     ...
   }
   ```

### Option 2: Using Only Open Source Components

If you want to use only the open-source components:

```bash
git clone https://github.com/your-org/civiq-open-source.git
cd civiq-open-source
npm install
```

## Integration Points

The repositories integrate through:

1. **Shared Interfaces** - Located in both repos at `src/shared/`
2. **Dependency Injection** - The open-source components use provider patterns to allow plugging in closed-source implementations
3. **Feature Flags** - Configuration allows running with or without closed-source features

## Maintaining Both Repositories

When making changes:

1. Update shared interfaces in both repositories
2. Run tests in both repositories to ensure compatibility
3. Version the open-source repository using semantic versioning
4. Update the dependency in the closed-source repository when making breaking changes

## Deployment

For deployment, you have options:

1. **Full Platform**: Deploy both repositories' code together
2. **Open Source Only**: Deploy just the open-source components, with limited functionality
3. **Hybrid Approach**: Deploy the open-source platform with selected closed-source modules

Refer to the deployment guides in each repository for specific instructions.