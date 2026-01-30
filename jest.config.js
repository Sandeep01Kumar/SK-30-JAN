module.exports = {
  // Use Node.js environment for HTTP server testing
  testEnvironment: 'node',

  // Show individual test results
  verbose: true,

  // Generate coverage report
  collectCoverage: true,

  // Coverage output location
  coverageDirectory: './coverage',

  // Only collect coverage from server.js
  collectCoverageFrom: ['server.js'],

  // Multiple report formats
  coverageReporters: ['text', 'lcov', 'html'],

  // 100% coverage thresholds as specified in Agent Action Plan
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  },

  // Test file pattern matching
  testMatch: ['**/*.test.js'],

  // 10 second timeout for server tests
  testTimeout: 10000,

  // Ensure process exits after tests
  forceExit: true,

  // Warn about open handles (important for server cleanup)
  detectOpenHandles: true
};
