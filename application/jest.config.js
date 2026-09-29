module.exports = {
  moduleNameMapper: {
    '^@f/(.*)$': '<rootDir>/front/$1',
    '^@s/(.*)$': '<rootDir>/server/$1',
    '^@c/(.*)$': '<rootDir>/common/$1',
    '^#app$': '<rootDir>/front/test/mocks/nuxtApp.js',
    '^@/(.*)$': '<rootDir>/front/$1',
    '^~/(.*)$': '<rootDir>/front/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': '@vue/vue3-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/front/components/**/*.vue',
    '<rootDir>/front/pages/**/*.vue',
  ],
  testEnvironment: 'jsdom',
};
