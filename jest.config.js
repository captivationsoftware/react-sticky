module.exports = {
  roots: ['<rootDir>/test'],
  unmockedModulePathPatterns: [
    'node_modules/react/',
    'node_modules/babel-runtime'
  ],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/*.{js,jsx}'],
  setupFiles: ['<rootDir>/test/setup.js']
};
