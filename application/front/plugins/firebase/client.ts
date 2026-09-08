import { Plugin } from '@nuxt/types';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfig } from '@c/firebaseConfig';

const plugin: Plugin = async ({ store }, inject) => {
  const app = getApps()[0] || initializeApp(firebaseConfig);
  const auth = getAuth(app);
  inject('fire', { auth });
  getAnalytics(app);
  // 最初の認証状態を反映してから画面を描画する。以降のログイン・ログアウトも監視する。
  await new Promise<void>((resolve, reject) => {
    onAuthStateChanged(
      auth,
      async (authUser) => {
        try {
          const claims = authUser
            ? (await authUser.getIdTokenResult(true)).claims
            : null;
          await store.dispatch(
            'firebaseAuthorization/onAuthStateChangedAction',
            { authUser, claims },
          );
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      reject,
    );
  });
};
export default plugin;
