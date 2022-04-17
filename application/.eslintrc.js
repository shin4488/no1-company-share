module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'prettier',
  ],
  plugins: [],
  // add your custom rules here
  rules: {
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
}
