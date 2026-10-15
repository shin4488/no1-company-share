import { defineNuxtPlugin, useRequestEvent } from '#app';
import { createAccessor } from '@f/store';

export default defineNuxtPlugin(async (nuxtApp) => {
  // ストアの状態は@pinia/nuxtがSSRのペイロードで画面へ引き継ぐ
  const accessor = createAccessor(nuxtApp.$pinia);
  if (typeof window === 'undefined') {
    const user = useRequestEvent()?.context.authUser;
    if (user) {
      await accessor.firebaseAuthorization.onAuthStateChangedAction({
        authUser: user,
      });
    }
  }
  return {
    provide: {
      accessor,
    },
  };
});
