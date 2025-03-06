# Shared Components

This directory contains code that is shared between the open-source and closed-source components of CivIQ. 

## Integration

When using this in conjunction with the closed-source components, you'll need to:

1. Ensure both repositories are using the same version of shared components
2. Create interfaces for closed-source functionality that will be exposed to the open-source code
3. Use dependency injection patterns to allow the open-source code to work with or without the closed-source components

## Types of Shared Code

- Data types and interfaces
- Utility functions
- Constants and configuration
- Common UI components
- API client interfaces