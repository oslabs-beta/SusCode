module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['**/src/**/*.test.ts', '**/src/**/*.test.tsx'],
  testPathIgnorePatterns: ['/node_modules/', '/out/', '/src/test/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
