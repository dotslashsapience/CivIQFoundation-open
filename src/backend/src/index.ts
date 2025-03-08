/**
 * CivIQ - A civic discourse platform
 * Copyright (c) 2025 CivIQ Foundation
 * 
 * This software is licensed under the CivIQ Ethical Licensing Agreement,
 * based on the Hippocratic License with additional provisions.
 * See LICENSE.md and TERMS_OF_USE.md for full details.
 * 
 * By using this software, you agree to uphold CivIQ's mission of fostering
 * meaningful, evidence-based discussions and combating misinformation.
 */

import fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './auth/routes';
import contentRoutes from './content/routes';
import profileRoutes from './profiles/routes';
import moderationRoutes from './moderation/routes';

// Create Fastify instance
const server = fastify({
  logger: true,
});

// Register plugins
server.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});

// Configure rate limiting to prevent abuse
server.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// Register routes
server.register(authRoutes, { prefix: '/auth' });
server.register(contentRoutes, { prefix: '/content' });
server.register(profileRoutes, { prefix: '/profiles' });
server.register(moderationRoutes, { prefix: '/moderation' });

// Health check route
server.get('/health', async () => {
  return { status: 'ok' };
});

// Start the server
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
    await server.listen({ port, host: '0.0.0.0' });
    server.log.info(`Server listening on ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();