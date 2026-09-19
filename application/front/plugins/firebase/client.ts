import { Plugin } from '@nuxt/types';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfig } from '@c/firebaseConfig';

const plugin: Plugin = ({ store, error }, inject) => {
  const app = getApps()[0] || initializeApp(firebaseConfig);
  const auth = getAuth(app);
  inject('fire', { auth });
  getAnalytics(app);
  const onAuthError = () => {
    error({
      statusCode: 503,
      message:
        '認証状態を確認できませんでした。ページを再読み込みしてください。',
    });
  };
  // SSRと同じストアでhydrationを完了してから、ブラウザ側の認証状態に同期する。
  // Service WorkerがIDトークンを付けられない初回訪問などでは、両者が異なり得る。
  window.onNuxtReady(() => {
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
        } catch {
          onAuthError();
        }
      },
      onAuthError,
    );
  });
};
export default plugin;
