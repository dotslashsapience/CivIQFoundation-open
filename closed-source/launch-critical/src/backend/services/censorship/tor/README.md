# CivIQ Tor Integration

This directory contains the implementation of CivIQ's Tor integration, a critical component of the platform's censorship resistance strategy.

## Overview

The Tor module provides alternative access to CivIQ through the Tor network using .onion services (hidden services), ensuring that the platform remains accessible in jurisdictions where conventional internet access might be blocked or monitored.

## Key Features

- **Hidden Service Deployment**: Automated creation and management of Tor .onion services
- **Connection Monitoring**: Continuous checking of Tor service availability
- **Fallback Access**: Alternative access path for users in restrictive environments
- **Zero Metadata**: Access without revealing user location or identity
- **Censorship Circumvention**: Bypass DNS-based and IP-based blocking

## Component Architecture

```
/tor/
├── TorService.js          - Core service for Tor hidden service management
├── StatusMonitor.js       - Monitors Tor service health
├── OnionController.js     - Controls Tor via control protocol
├── metrics/               - Service metrics collection
└── utils/                 - Utility functions for Tor operations
```

## Implementation Details

### TorService

The `TorService` is the main entry point for Tor interactions. It provides functionality for:

- Setting up and configuring Tor hidden services
- Monitoring service availability
- Managing service credentials
- Testing connectivity

### Configuration

The Tor integration is configured through the central censorship configuration file (`config/censorship.config.js`). Key configuration options include:

```javascript
alternativeRouting: {
  tor: {
    enabled: true,
    // Tor hidden service address (v3 onion address)
    onionAddress: process.env.TOR_ONION_ADDRESS,
    // Tor control port configuration
    controlPort: process.env.TOR_CONTROL_PORT || 9051,
    controlPassword: process.env.TOR_CONTROL_PASSWORD,
    // Auto-configure Tor hidden service
    autoConfig: process.env.TOR_AUTO_CONFIG === 'true'
  }
}
```

## Usage Examples

### Getting Tor Service Status

```javascript
const torService = require('./TorService');

// Get current status of the Tor service
const status = torService.getServiceStatus();
console.log(`Tor service running: ${status.running}`);
console.log(`Onion address: ${status.onionAddress}`);

// Get the full .onion URL
const onionUrl = torService.getOnionUrl();
console.log(`Access CivIQ via Tor at: ${onionUrl}`);
```

### Testing Tor Connectivity

```javascript
const torService = require('./TorService');

async function checkTorAccess() {
  // Test connectivity to the Tor hidden service
  const result = await torService.testConnectivity();
  
  if (result.accessible) {
    console.log(`Successfully connected to Tor service (status: ${result.statusCode})`);
  } else {
    console.error(`Failed to connect to Tor service: ${result.message}`);
  }
}

checkTorAccess();
```

## Setup Requirements

To use the Tor integration, the following prerequisites must be met:

1. **Tor Installation**: The Tor daemon must be installed on the server
2. **Control Port**: The Tor control port must be enabled and accessible
3. **Authentication**: A control password must be configured for Tor control access
4. **Port Forwarding**: The service port (typically 80) must be mapped to the application port

### Tor Service Configuration

The following configuration should be added to the Tor configuration file (`/etc/tor/torrc`):

```
# Enable the control port
ControlPort 9051

# Set a control password (generate with: tor --hash-password "your_password")
HashedControlPassword 16:01234567890ABCDEF...

# Set up the hidden service directory
HiddenServiceDir /var/lib/tor/hidden_services/civiq_service/
HiddenServicePort 80 127.0.0.1:3000
```

## Security Considerations

- The Tor control password should be stored securely and never exposed
- The hidden service private key must be protected at all costs
- Regular monitoring should verify the service remains accessible
- Multiple safety measures should validate the correct operation of the service
- Tor updates should be applied promptly to address security vulnerabilities

## Monitoring and Maintenance

The Tor module includes monitoring capabilities to ensure the health of the Tor integration:

- Regular connectivity checks
- Service directory validation
- Control port communication verification
- Redeployment capabilities if the service becomes unavailable

## Performance Considerations

Accessing CivIQ via Tor will be significantly slower than regular web access. The module implements several optimizations:

- Optimized content delivery for Tor users
- Reduced media size for bandwidth-constrained connections
- Minimized JavaScript for better performance over high-latency connections
- Optional text-only mode for extreme conditions

## Related Components

- I2P integration for additional anonymous network access
- Mirror site deployment for geographic redundancy
- ENS/Handshake integration for decentralized naming
- IPFS gateway for content delivery

## Troubleshooting

Common issues and their solutions:

1. **Cannot Connect to Control Port**
   - Verify Tor is running: `systemctl status tor`
   - Check control port configuration: `grep ControlPort /etc/tor/torrc`
   - Test connectivity: `telnet localhost 9051`

2. **Hidden Service Not Accessible**
   - Verify service directory permissions
   - Check application is listening on the correct port
   - Test locally with torsocks: `torsocks curl http://your-onion-address.onion`

3. **Authentication Failures**
   - Regenerate the control password: `tor --hash-password "new_password"`
   - Update configuration with the new hashed password
   - Restart Tor: `systemctl restart tor`

## Resources

- [Tor Project Documentation](https://www.torproject.org/docs/)
- [Tor Control Protocol Specification](https://gitweb.torproject.org/torspec.git/tree/control-spec.txt)
- [Hidden Service Configuration Guide](https://community.torproject.org/onion-services/setup/)
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
