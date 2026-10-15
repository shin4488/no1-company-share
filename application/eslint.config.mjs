import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import prettier from 'eslint-config-prettier/flat';
import n from 'eslint-plugin-n';
import promise from 'eslint-plugin-promise';
import globals from 'globals';

// 使わない引数は、後ろの引数を使う場合も「_」始まりの名前にする
const unusedVarsOptions = { args: 'all', argsIgnorePattern: '^_' };

export default createConfigForNuxt({
  features: {
    typescript: true,
    // 書式はprettierで統一する
    stylistic: false,
    tooling: { unicorn: true, jsdoc: false, regexp: false },
  },
  dirs: {
    src: ['./front'],
  },
}).append(
  {
    files: ['front/test/**'],
    languageOptions: {
      globals: globals.vitest,
    },
  },
  {
    // importScriptsで読み込むFirebase SDKのグローバル変数を使う
    files: ['front/static/firebase-auth-sw.js'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        firebase: 'readonly',
      },
    },
  },
  prettier,
  {
    plugins: { n, promise },
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
      'vue/multi-word-component-names': 'off',
      // 必須のpropsにもdefaultを書いている
      'vue/no-required-prop-with-default': 'off',
      // 以下は、@nuxt/eslint-configに無い、またはオプションが異なる検査
      'accessor-pairs': 'error',
      'array-callback-return': 'error',
      camelcase: [
        'error',
        { allow: ['^UNSAFE_'], properties: 'never', ignoreGlobals: true },
      ],
      'default-case-last': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'import/export': 'error',
      'import/no-absolute-path': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true },
      ],
      'n/handle-callback-err': ['error', '^(err|error)$'],
      'n/no-callback-literal': 'error',
      'n/no-deprecated-api': 'error',
      'n/no-exports-assign': 'error',
      'n/no-new-require': 'error',
      'n/no-path-concat': 'error',
      'new-cap': ['error', { capIsNew: false }],
      'no-caller': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-implied-eval': 'error',
      'no-iterator': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-lonely-if': 'error',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-object-constructor': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-template-curly-in-string': 'error',
      'no-throw-literal': 'error',
      'no-undef-init': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'no-use-before-define': [
        'error',
        { functions: false, classes: false, variables: false },
      ],
      'no-useless-call': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      'object-shorthand': 'error',
      'one-var': ['error', { initialized: 'never' }],
      'prefer-exponentiation-operator': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
      'promise/param-names': 'error',
      'require-await': 'error',
      'spaced-comment': [
        'error',
        'always',
        {
          line: { markers: ['*package', '!', '/', ',', '='] },
          block: {
            balanced: true,
            markers: ['*package', '!', ',', ':', '::', 'flow-include'],
            exceptions: ['*'],
          },
        },
      ],
      'symbol-description': 'error',
      'use-isnan': ['error', { enforceForIndexOf: true }],
      'valid-typeof': ['error', { requireStringLiterals: true }],
      yoda: 'error',
    },
  },
  {
    // ts・vueでは@typescript-eslintの同等のルールが有効になっている
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    rules: {
      'no-array-constructor': 'error',
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
      'no-unused-vars': ['error', unusedVarsOptions],
      'no-useless-constructor': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      // typescript-eslintは型検査に任せてこれらを無効にするが、型検査はtestでだけ行うため、lintでも検出する
      'constructor-super': 'error',
      'getter-return': 'error',
      'no-class-assign': 'error',
      'no-const-assign': 'error',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-dupe-keys': 'error',
      'no-func-assign': 'error',
      'no-import-assign': 'error',
      'no-new-native-nonconstructor': 'error',
      'no-obj-calls': 'error',
      'no-setter-return': 'error',
      'no-this-before-super': 'error',
      'no-unreachable': 'error',
      'no-unsafe-negation': 'error',
      'no-with': 'error',
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/no-unused-vars': ['error', unusedVarsOptions],
      // 型だけのimportも通常のimportで書いている。emitDecoratorMetadataを使うDIクラスでは型importへの変換で実行時のメタデータが変わりうるため、一括で書き換えない
      '@typescript-eslint/consistent-type-imports': 'off',
      // ExpressのRequestとlog4jsの型定義に合わせてanyを使っている
      '@typescript-eslint/no-explicit-any': 'off',
      // ajax処理の型引数の既定値に{}を使っている
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowObjectTypes: 'always' },
      ],
      // 静的メソッドだけのクラスで共通処理をまとめている
      '@typescript-eslint/no-extraneous-class': 'off',
      // 結果を返さずに閉じたダイアログを「| void」で表している
      '@typescript-eslint/no-invalid-void-type': 'off',
    },
  },
);
