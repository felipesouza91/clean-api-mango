module.exports = {
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  collectCoverageFrom: ['**/src/**/*.js', '!**/src/main/**.js', '!**/src/main/config/env.js'],
  preset: '@shelf/jest-mongodb'
}
