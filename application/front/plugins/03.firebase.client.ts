import { getApps, initializeApp } from 'firebase/app';
import { defineNuxtPlugin, showError } from '#app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfig } from '@c/firebaseConfig';

export default defineNuxtPlugin((nuxtApp) => {
  const app = getApps()[0] || initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const fire = { auth };
  nuxtApp.$store.$fire = fire;
  const isLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(
    window.location.hostname,
  );
  if (process.env.NODE_ENV === 'production' && !isLocalhost) {
    getAnalytics(app);
  }

  nuxtApp.hook('app:mounted', () => {
    let authVersion = 0;
    onAuthStateChanged(
      auth,
      async (authUser) => {
        const version = ++authVersion;
        try {
          const result = authUser
            ? await authUser.getIdTokenResult(true)
            : null;
          if (version !== authVersion) {
            return;
          }
          await nuxtApp.$store.dispatch(
            'firebaseAuthorization/onAuthStateChangedAction',
            {
              authUser:
                authUser && result
                  ? {
                      uid: authUser.uid,
                      idToken: result.token,
                      photoURL: authUser.photoURL,
                      displayName: authUser.displayName,
                    }
                  : null,
            },
          );
        } catch {
          if (version === authVersion) {
            showError({
              statusCode: 503,
              message:
                '認証状態を確認できませんでした。ページを再読み込みしてください。',
            });
          }
        }
      },
      () => {
        ++authVersion;
        showError({
          statusCode: 503,
          message:
            '認証状態を確認できませんでした。ページを再読み込みしてください。',
        });
      },
    );
  });
  return { provide: { fire } };
});
