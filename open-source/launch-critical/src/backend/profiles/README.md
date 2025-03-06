# CivIQ User Profiles Service

This directory contains the implementation of CivIQ's user profile system, a launch-critical component that manages user identity information, settings, and data portability.

## Core Mission

To provide a robust user profile system that balances identity verification requirements with privacy protections, while ensuring data portability and user control over personal information.

## Key Features

- **Core Profile Data**: Management of essential user information
- **Profile Photos**: Required profile picture handling
- **User Bios**: Biographical information management
- **Profile Privacy**: Granular privacy controls
- **Settings Management**: User preference handling
- **Data Export**: Comprehensive data portability
- **Profile Verification**: Connection to identity verification

## Module Structure

```
/profiles/
├── badges/          - User achievement and verification badges
├── bio/             - User biographical information
├── core/            - Essential profile functionality
├── export/          - Data export and portability
├── photos/          - Profile photo management
├── portability/     - Data migration and interoperability
├── privacy/         - Privacy controls and settings
└── settings/        - User preferences and configurations
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+ (for caching)
- Storage system for profile media

### Installation

```bash
# Install dependencies for all profile modules
npm install --prefix src/backend/services/profiles

# Configure your environment variables
cp .env.example .env
```

Edit the `.env` file with your specific configuration for databases, storage, and related services.

### Configuration

The profile system configuration is managed through:

1. **Service Configuration**: `src/backend/services/profiles/config.js`
2. **Global Settings**: Various platform-wide configuration files

These define:

- Required profile fields
- Privacy settings and defaults
- Export formats and schedules
- Storage locations and strategies
- Validation rules

## Architecture

### Profile Data Model

The profile data model includes:

1. **Core Data**: Essential information like username, display name
2. **Required Information**: Profile photos, brief biography
3. **Optional Fields**: Additional user-provided information
4. **Privacy Settings**: Controls for information visibility
5. **Verification Status**: Connection to identity verification system
6. **Activity Information**: Limited information about user activity

### Data Portability

The data portability system provides:

1. **Complete Export**: All user data in portable formats
2. **Selective Export**: Specific data categories on request
3. **Automated Exports**: Scheduled backups for high-value accounts
4. **Import Capabilities**: Data import from supported platforms
5. **Decentralized Backups**: Connection to censorship resistance systems

## Implementation Guide

To implement profile-related features:

1. All profile data must implement the `IPortableData` interface
2. Use the `ProfileService` for all profile operations
3. Respect privacy settings for all data access
4. Implement validation for all user-provided information
5. Connect to the identity verification system for verification status

### Profile Creation Implementation

```javascript
// Example profile creation process
const createUserProfile = async (userId, profileData) => {
  const profileService = new ProfileService();
  
  // Validate required fields
  const validationResult = await profileService.validateProfileData(profileData);
  
  if (!validationResult.valid) {
    return {
      success: false,
      errors: validationResult.errors
    };
  }
  
  // Process profile photo if provided
  let photoUrl = null;
  if (profileData.photo) {
    photoUrl = await profileService.photos.processAndStore(
      userId,
      profileData.photo
    );
  }
  
  // Create core profile
  const profile = await profileService.core.createProfile({
    userId,
    displayName: profileData.displayName,
    username: profileData.username,
    bio: profileData.bio,
    photoUrl,
    privacySettings: profileData.privacySettings || profileService.getDefaultPrivacySettings()
  });
  
  // Initialize profile settings
  await profileService.settings.initializeSettings(userId, profileData.settings);
  
  // Link to identity verification if available
  if (profileData.identityVerification) {
    await profileService.linkIdentityVerification(userId, profileData.identityVerification);
  }
  
  return {
    success: true,
    profile
  };
};
```

## Security Considerations

- Profile data must be validated to prevent injection attacks
- Profile photos must be sanitized and processed safely
- Privacy settings must be enforced consistently
- Profile data must be protected from unauthorized access
- Export functionality must verify user identity before providing data
- Sensitive profile attributes must be properly encrypted

## Privacy Protections

The profile system includes specific privacy protections:

- Granular visibility controls for different profile attributes
- Special protections for high-risk users
- Limited data collection focused on essential information
- Clear disclosure of how profile data is used
- Regular data retention reviews

## Related Services

- Identity Service
- Content Service
- Moderation Service
- Web of Trust Service

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
