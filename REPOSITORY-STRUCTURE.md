# CivIQ Repository Structure

## Overview

The CivIQ platform is divided into two main repositories:

1. **Open Source** (`open-source/`) - Contains all publicly available components
2. **Closed Source** (`closed-source/`) - Contains proprietary components

Each repository is further organized into:

- **Launch Critical** - Components required for initial platform launch
- **Post Launch** - Components planned for future implementation

## Directory Structure

```
CivIQ/
├── open-source/                 # Open source repository
│   ├── launch-critical/         # Critical components needed for launch
│   │   ├── src/
│   │   │   ├── frontend/        # User interface components
│   │   │   ├── backend/
│   │   │   │   ├── api/         # Public API endpoints
│   │   │   │   ├── content/     # Content management
│   │   │   │   ├── messaging/   # Core messaging
│   │   │   │   ├── profiles/    # User profile management
│   │   │   ├── shared/          # Shared code between open/closed
│   │   ├── tests/               # Test suite
│   │   ├── docs/                # Documentation
│   │   └── config/              # Configuration files
│   ├── post-launch/             # Features for later implementation
│   │   └── src/
│   │       └── backend/
│   │           └── services/
│   │               ├── dataPortability/
│   │               ├── notifications/
│   │               ├── reactions/
│   │               └── search/
│   ├── package.json             # Project dependencies
│   ├── README.md                # Project documentation
│   └── .gitignore               # Git ignore patterns
│
├── closed-source/               # Closed source repository
│   ├── launch-critical/         # Critical components needed for launch
│   │   ├── src/
│   │   │   ├── backend/
│   │   │   │   ├── services/
│   │   │   │   │   ├── algorithm/     # Content ranking
│   │   │   │   │   ├── botDetection/  # Automated account prevention
│   │   │   │   │   ├── censorship/    # Platform resilience 
│   │   │   │   │   ├── identity/      # User verification
│   │   │   │   │   └── moderation/    # Content moderation
│   │   │   │   └── security/          # Platform security
│   │   │   └── shared/                # Shared code between open/closed
│   │   ├── tests/                     # Test suite
│   │   ├── docs/                      # Documentation
│   │   └── config/                    # Configuration files
│   ├── post-launch/                   # Features for later implementation
│   │   └── src/
│   │       └── backend/
│   │           └── services/
│   │               ├── advertisements/
│   │               ├── analytics/
│   │               ├── badges/
│   │               ├── factChecking/
│   │               ├── federatedAuth/
│   │               ├── privacyMode/
│   │               └── transparency/
│   ├── package.json                   # Project dependencies
│   ├── README.md                      # Project documentation
│   └── .gitignore                     # Git ignore patterns
│
└── INTEGRATING-REPOSITORIES.md        # Integration guide
```

## Integration

The open source and closed source components integrate through:

1. **Shared Interfaces** - Located in the `shared/` directory of both repositories
2. **Dependency Injection** - The open source components use provider patterns
3. **Feature Flags** - Configuration allows running with or without closed source features

See `INTEGRATING-REPOSITORIES.md` for detailed integration instructions.