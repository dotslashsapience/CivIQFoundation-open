# CivIQ Developer Guide

This guide provides all the information needed to set up your development environment and contribute to the CivIQ platform.

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- PostgreSQL (v14 or higher)
- Redis (v6 or higher)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/civiq-foundation/civiq-platform.git
   cd civiq-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in the root directory:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/civiq
   REDIS_URL=redis://localhost:6379
   KICKBOX_API_KEY=your_kickbox_api_key
   ```

4. Start the development servers:
   ```bash
   npm run dev
   ```

## Development Workflow

1. Create a new branch for your feature or bugfix
2. Make changes and commit them
3. Run tests: `npm test`
4. Ensure your code follows the style guidelines: `npm run lint`
5. Submit a pull request

## Architecture Overview

The CivIQ platform is organized into three main packages:

1. **Frontend**: Next.js application for the user interface
2. **Backend**: Fastify-based API server
3. **Shared**: Common code used by both frontend and backend

## Coding Standards

- Follow TypeScript best practices
- Write unit tests for all new features
- Document your code with JSDoc comments
- Follow the project's ESLint rules

Copyright © 2025 CivIQ Foundation