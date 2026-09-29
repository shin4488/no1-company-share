import { StringUtil } from '@c/util/stringUtil';
import { defineNuxtRouteMiddleware, useNuxtApp, navigateTo } from '#app';

export default defineNuxtRouteMiddleware(async (to) => {
  const { $accessor } = useNuxtApp();
  if (to.path === '/login') {
    if (typeof window !== 'undefined') {
      await $accessor.firebaseAuthorization.loginByGoogle();
    }
    return navigateTo('/home');
  }
  if (to.path === '/logout') {
    if (typeof window !== 'undefined') {
      await $accessor.firebaseAuthorization.logout();
    }
    return navigateTo('/home');
  }
  if (to.path === '/') {
    return navigateTo('/home');
  }
  if (
    !['/home', '/usage'].includes(to.path) &&
    StringUtil.isEmpty($accessor.firebaseAuthorization.userIdComputed)
  ) {
    return navigateTo('/home');
  }
});
