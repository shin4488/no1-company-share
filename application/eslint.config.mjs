import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import prettier from 'eslint-config-prettier/flat';
import globals from 'globals';

export default createConfigForNuxt({
  features: {
    typescript: true,
    // 書式はprettierで統一する
    stylistic: false,
  },
  dirs: {
    src: ['./front'],
  },
}).append(
  {
    files: ['front/test/**'],
    languageOptions: {
      globals: globals.jest,
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
    },
  },
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
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
