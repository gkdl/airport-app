/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@airport-app/types$': '<rootDir>/../types/src/index.ts',
  },
};
