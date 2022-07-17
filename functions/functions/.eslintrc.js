module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'import/no-unresolved': 0,
    'no-console': 'warn',
    'no-extra-semi': 'warn',
    'dot-notation': 'warn',
    'prefer-const': 'error',
    'no-unreachable-loop': 'error',
    'no-var': 'error',
    // 「if () return;」のような記述は「{}」つきの記述とする
    curly: 'error',
    // 「(obj?.foo)();」->「(obj?.foo)?.();」
    'no-unsafe-optional-chaining': 'error',
  },
};
