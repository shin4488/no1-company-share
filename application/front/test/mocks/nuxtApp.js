import { ref } from 'vue';

export const defineNuxtPlugin = (plugin) => plugin;
export const defineNuxtRouteMiddleware = (middleware) => middleware;
export const refreshNuxtData = vi.fn().mockResolvedValue(undefined);
export const showError = vi.fn();
export const useRequestEvent = vi.fn(() => undefined);
export const useNuxtApp = vi.fn();
export const navigateTo = vi.fn();
export const useHead = vi.fn();
// 画面の初回表示では、データを取得し終えた状態で描画する
export const useAsyncData = async (_key, handler) => ({
  data: ref(await handler()),
});
