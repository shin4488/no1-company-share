import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

const dir = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [vue()],
  // サーバーのDIはTypeScriptの旧仕様のデコレーターを使う。本番のNitroと同じく、型のメタデータは出力しない
  oxc: { decorator: { legacy: true } },
  resolve: {
    alias: {
      '#app': dir('./front/test/mocks/nuxtApp.js'),
      '@f': dir('./front'),
      '@s': dir('./server'),
      '@c': dir('./common'),
      '@': dir('./front'),
      '~': dir('./front'),
    },
  },
  test: {
    include: ['front/test/**/*.spec.js'],
    environment: 'jsdom',
    globals: true,
    // VuetifyはCSSをimportするため、Nodeに直接読み込ませずViteで変換する
    server: { deps: { inline: ['vuetify'] } },
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['front/components/**/*.vue', 'front/pages/**/*.vue'],
    },
  },
});
