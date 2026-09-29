export const defineNuxtPlugin = (plugin) => plugin;
export const defineNuxtRouteMiddleware = (middleware) => middleware;
export const refreshNuxtData = jest.fn().mockResolvedValue(undefined);
export const showError = jest.fn();
export const useRequestEvent = jest.fn(() => undefined);
export const useNuxtApp = jest.fn();
export const navigateTo = jest.fn();
