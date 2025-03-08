# CivIQ Tests

This directory contains all the tests for the CivIQ platform.

## Directory Structure

- `/unit`: Unit tests for individual components and functions
- `/integration`: Integration tests for combined components
- `/e2e`: End-to-end tests that simulate user flows

## Running Tests

You can run tests using the following npm scripts:

```bash
# Run all tests
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run only end-to-end tests
npm run test:e2e
```

## Writing Tests

When writing tests, follow these guidelines:

1. **Unit Tests**: Test individual functions and components in isolation.
2. **Integration Tests**: Test how components interact with each other.
3. **End-to-End Tests**: Test complete user flows from the front to the back end.

### Example Test Structure

```javascript
describe('Feature: User Authentication', () => {
  describe('Unit: Password Hashing', () => {
    it('should hash a password', () => {
      // Test password hashing logic
    });
    
    it('should verify a password against a hash', () => {
      // Test password verification
    });
  });
  
  describe('Integration: User Registration', () => {
    it('should register a new user', async () => {
      // Test registration API
    });
    
    it('should prevent duplicate registrations', async () => {
      // Test duplicate prevention
    });
  });
});
```

## Test Database

Integration and E2E tests use a separate test database. This database is automatically created and seeded with test data when running tests.

## Mocking

For unit tests, use mocks for external dependencies (database, Redis, etc.) to isolate the component being tested.

Copyright © 2025 CivIQ Foundation