import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import { createNodeResolver, importX } from 'eslint-plugin-import-x';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['lib/'] },
  js.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  tseslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: globals.node,
    },
    settings: {
      'import-x/resolver-next': [createNodeResolver()],
    },
    rules: {
      'import-x/no-unresolved': 'off',
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
      // 以下は、上の設定に無い検査
      camelcase: ['error', { properties: 'never' }],
      'guard-for-in': 'error',
      'new-cap': 'error',
      'no-caller': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-invalid-this': 'error',
      'no-multi-str': 'error',
      'no-new-wrappers': 'error',
      'no-object-constructor': 'error',
      'no-throw-literal': 'error',
      'one-var': ['error', 'never'],
      'prefer-promise-reject-errors': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'spaced-comment': ['error', 'always'],
    },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    // テストは子プロセスの標準出力で、Functionsが外部APIを呼んだかを確かめる
    files: ['tests/**'],
    rules: {
      'no-console': 'off',
    },
  },
);
