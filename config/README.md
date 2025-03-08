# CivIQ Configuration

This directory contains configuration files for different environments and services used by the CivIQ platform.

## Files

- `default.js` - Default configuration values
- `development.js` - Development environment configuration overrides
- `production.js` - Production environment configuration overrides
- `test.js` - Test environment configuration overrides

## Usage

Configuration is loaded based on the current `NODE_ENV` environment variable. The default configuration is loaded first, then the environment-specific configuration is merged on top.

```javascript
// Example configuration usage
const config = require('../config');

console.log(config.database.url); // Outputs the database URL for the current environment
```

## Configuration Structure

The configuration files follow this structure:

```javascript
module.exports = {
  server: {
    port: 8000,
    host: '0.0.0.0',
  },
  database: {
    url: 'postgresql://postgres:postgres@localhost:5432/civiq',
  },
  redis: {
    url: 'redis://localhost:6379',
  },
  auth: {
    jwtSecret: 'development_secret',
    jwtExpiresIn: '7d',
  },
  apis: {
    kickbox: {
      apiKey: process.env.KICKBOX_API_KEY || 'development_key',
    },
  },
};
```

Copyright © 2025 CivIQ Foundation