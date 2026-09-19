import Vue from 'vue';
import Vuex, { Store } from 'vuex';
import { signInWithPopup } from 'firebase/auth';
import plugin from '../plugins/firebase/client';
import * as authorization from '../store/firebaseAuthorization';

Vue.use(Vuex);
let listener;
let ready;
jest.mock('firebase/app', () => ({ getApps: () => ['app'] }));
jest.mock('firebase/auth', () => ({
  getAuth: () => ({}),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  onAuthStateChanged: (_auth, callback) => {
    listener = callback;
  },
}));
jest.mock('firebase/analytics', () => ({ getAnalytics: jest.fn() }));
jest.mock('@c/firebaseConfig', () => ({ firebaseConfig: {} }));

const user = (uid) => ({
  uid,
  photoURL: `/${uid}.png`,
  displayName: `User ${uid}`,
  getIdTokenResult: jest
    .fn()
    .mockResolvedValue({ token: `${uid}-token`, claims: {} }),
  getIdToken: jest
    .fn()
    .mockRejectedValue(new Error('unexpected second token fetch')),
});

async function start() {
  window.onNuxtReady = (callback) => {
    ready = callback;
  };
  const store = new Store({
    modules: {
      firebaseAuthorization: { ...authorization, namespaced: true },
    },
  });
  const error = jest.fn();
  await plugin({ store, error }, jest.fn());
  ready();
  return { store, error };
}

afterEach(() => {
  delete window.onNuxtReady;
});

test('実際の認証ストアへトークンとプロフィールを一緒に反映し、ログアウトで消去する', async () => {
  const { store, error } = await start();
  const account = user('member');
  await listener(account);
  expect(store.state.firebaseAuthorization).toEqual({
    userId: 'member',
    idToken: 'member-token',
    iconImageUrl: '/member.png',
    displayedName: 'User member',
  });
  expect(account.getIdToken).not.toHaveBeenCalled();
  await listener(null);
  expect(store.state.firebaseAuthorization).toEqual({
    userId: null,
    idToken: null,
    iconImageUrl: null,
    displayedName: null,
  });
  expect(error).not.toHaveBeenCalled();
});

test('遅い前ユーザーの同期が後から完了しても、新ユーザーの実ストアを上書きしない', async () => {
  const { store, error } = await start();
  const first = user('first');
  let finish;
  first.getIdTokenResult.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const pending = listener(first);
  await listener(user('second'));
  finish({ token: 'first-token', claims: {} });
  await pending;
  expect(store.state.firebaseAuthorization.userId).toBe('second');
  expect(store.state.firebaseAuthorization.idToken).toBe('second-token');
  expect(error).not.toHaveBeenCalled();
});

test('Googleログインの完了がログアウト後に届いても、実ストアをログイン状態に戻さない', async () => {
  const { store } = await start();
  store.$fire = { auth: {} };
  const account = user('stale');
  account.getIdToken.mockResolvedValue('stale-token');
  let completeLogin;
  signInWithPopup.mockImplementation(
    () =>
      new Promise((resolve) => {
        completeLogin = resolve;
      }),
  );
  const pending = store.dispatch('firebaseAuthorization/loginByGoogle');
  await listener(account);
  await listener(null);
  completeLogin({ user: account });
  await pending;
  expect(store.state.firebaseAuthorization.userId).toBeNull();
  expect(store.state.firebaseAuthorization.idToken).toBeNull();
});
