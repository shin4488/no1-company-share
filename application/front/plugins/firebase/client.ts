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
    let authVersion = 0;
    onAuthStateChanged(
      auth,
      async (authUser) => {
        const version = ++authVersion;
        try {
          const result = authUser
            ? await authUser.getIdTokenResult(true)
            : null;
          // トークンの取得中にログアウトや別ユーザーへの切り替えが起き得る。
          if (version !== authVersion) {
            return;
          }
          await store.dispatch(
            'firebaseAuthorization/onAuthStateChangedAction',
            {
              // ストア内で再びトークン取得を待たず、取得済みの同じ状態を反映する。
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
            onAuthError();
          }
        }
      },
      () => {
        ++authVersion;
        onAuthError();
      },
    );
  });
};
export default plugin;
