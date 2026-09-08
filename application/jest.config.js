module.exports = {
  moduleNameMapper: {
    '^@f/(.*)$': '<rootDir>/front/$1',
    '^@s/(.*)$': '<rootDir>/server/$1',
    '^@c/(.*)$': '<rootDir>/common/$1',
    '^@/(.*)$': '<rootDir>/front/$1',
    '^~/(.*)$': '<rootDir>/front/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/front/components/**/*.vue',
    '<rootDir>/front/pages/**/*.vue',
  ],
  testEnvironment: 'jsdom',
};
