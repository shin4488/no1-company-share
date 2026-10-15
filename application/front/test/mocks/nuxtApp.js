export const defineNuxtPlugin = (plugin) => plugin;
export const defineNuxtRouteMiddleware = (middleware) => middleware;
export const refreshNuxtData = vi.fn().mockResolvedValue(undefined);
export const showError = vi.fn();
export const useRequestEvent = vi.fn(() => undefined);
export const useNuxtApp = vi.fn();
export const navigateTo = vi.fn();
