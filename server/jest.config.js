module.exports = {
    // Root directory for Jest to scan for tests and modules within
    rootDir: './',
    
    // A list of paths to directories that Jest should use to search for files in
    roots: ['<rootDir>/tests/jest'],
    
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    
    // Indicates whether each individual test should be reported during the run
    verbose: true,
    
    // The test environment that will be used for testing
    testEnvironment: 'node',
    
    // A map from regular expressions to paths to transformers
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    
    // Specifies the directories Jest should ignore
    testPathIgnorePatterns: [
      '/node_modules/',
      '/playwright/',
    ],
    
    // A preset that is used as a base for Jest's configuration
    preset: null,
    
    // Remove or comment out the setupFilesAfterEnv entry if not needed
    // setupFilesAfterEnv: ['<rootDir>/tests/jest/setupTests.js'],
    
    // Coverage thresholds to apply globally
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    
    // Paths to directories where Jest should output its coverage files
    coverageDirectory: '<rootDir>/tests/jest/coverage',
  };
  