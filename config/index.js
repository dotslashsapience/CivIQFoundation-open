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

/**
 * Configuration loader
 * Loads default config first, then environment-specific config
 */

const defaultConfig = require('./default');

// Determine which environment config to load
const env = process.env.NODE_ENV || 'development';
let envConfig = {};

try {
  envConfig = require(`./${env}`);
  console.log(`Loaded ${env} configuration`);
} catch (error) {
  console.warn(`No configuration found for environment: ${env}, using default only`);
}

// Helper function to deep merge configurations
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] === Object(source[key]) && !Array.isArray(source[key])) {
      target[key] = target[key] || {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Merge configurations
const config = deepMerge({ ...defaultConfig }, envConfig);

module.exports = config;