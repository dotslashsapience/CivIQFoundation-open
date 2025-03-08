# CivIQ Backend

This directory contains the backend services for the CivIQ platform, built with Fastify and PostgreSQL.

## Directory Structure

- `/api`: API endpoints and routes
- `/auth`: Authentication and identity verification
- `/content`: Content management and ranking
- `/moderation`: Moderation system
- `/profiles`: User profiles and reputation system

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Key Features

- Identity verification and bot prevention
- Content ranking algorithm
- User reputation system
- Moderation tools
- Rate limiting

## Technology Stack

- Fastify - Fast and low overhead web framework
- PostgreSQL - Relational database for structured data
- Redis - For caching and rate limiting
- Weaviate - Vector search engine for content ranking

Copyright © 2025 CivIQ Foundation