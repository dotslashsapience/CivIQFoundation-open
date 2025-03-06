# CivIQ Frontend Components

This directory contains all the React components used in the CivIQ platform frontend. Each component follows a modular structure and adheres to established design patterns to maintain consistency and reusability.

## Core Components

### Feed View

The Feed View component displays content to users based on the algorithm's recommendations. It incorporates viewpoint diversity, anti-radicalization measures, and personalization while maintaining transparency.

**Key Features:**
- Infinite scrolling with virtualized list rendering
- Content categorization and filtering
- Transparency indicators showing why content is displayed
- Viewpoint diversity metrics
- Time-decay visualization
- User-controlled feed customization options

**Implementation Details:**
- Uses React Query for data fetching and caching
- Implements virtualized rendering for performance
- Connects to the backend feed service for content retrieval
- Supports multiple content types and formats

### Content Creation

The Content Creation component provides a rich interface for users to create, edit, and publish content across different formats.

**Key Features:**
- Rich text editor with markdown support
- Media embedding (images, videos, links)
- Draft saving and auto-recovery
- Content guidelines and civility score preview
- Publishing options (visibility, communities)
- Decentralized storage options

**Implementation Details:**
- Built on top of Slate.js for the rich text editing
- Client-side validation and civility scoring
- Support for uploading to conventional or decentralized storage
- Progressive enhancement for different device capabilities

### Comments

The Comments component facilitates discussion around content with features to promote civil discourse.

**Key Features:**
- Threaded conversation support
- Civility score indicators
- Community moderation tools
- Sorting options (newest, oldest, most engaged)
- Collapsible threads
- Embedded media support

**Implementation Details:**
- Lazy loading for performance optimization
- Real-time updates for active discussions
- Integration with moderation and civility scoring systems
- Accessibility features for screen readers

### User Profiles

The User Profiles component displays user information while respecting privacy preferences and identity verification status.

**Key Features:**
- Customizable profile information display
- Reputation and trust indicators
- Content history and contribution metrics
- Privacy controls
- Verification status indicators
- Web of Trust connections

**Implementation Details:**
- Progressive loading of profile data
- Privacy-respecting data display based on user settings
- Integration with the identity and web of trust services
- Cached profile data with selective invalidation

### Authentication

The Authentication component handles user registration, login, and identity verification processes.

**Key Features:**
- Multiple authentication methods (email, federated, cryptographic)
- Two-factor authentication support
- Privacy-preserving verification flows
- Account recovery mechanisms
- Session management

**Implementation Details:**
- JWT-based authentication
- Secure credential storage
- Integration with federated authentication providers
- Support for cryptographic identity verification
- Compliance with privacy regulations

## Design System

All components follow the CivIQ design system, which ensures:

- Consistent styling and user experience
- Accessibility compliance (WCAG 2.1 AA)
- Responsive design for all device sizes
- Theme support (light/dark modes)
- Internationalization support

## Development Guidelines

When extending or modifying components:

1. Maintain separation of concerns (UI logic vs. business logic)
2. Ensure all components are fully tested
3. Follow accessibility best practices
4. Document props and state management
5. Consider performance implications for large datasets
6. Adhere to established design patterns

## License

This component is licensed under the GNU Affero General Public License Version 3 (AGPL-3.0), the same license used for the overall CivIQ Platform. The AGPL-3.0 license ensures that the source code remains open and available to all users, even when the platform is being provided as a service over a network.

For more details, see the [LICENSE.md](../../../../LICENSE.md) file in the project root.

Copyright © 2025 CivIQ Platform