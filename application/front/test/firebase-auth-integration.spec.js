import { createStore } from 'vuex';
import { signInWithPopup } from 'firebase/auth';
import plugin from '../plugins/03.firebase.client';
import * as authorization from '../store/firebaseAuthorization';

let mockListener;
jest.mock('firebase/app', () => ({ getApps: () => ['app'] }));
jest.mock('firebase/auth', () => ({
  getAuth: () => ({}),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: (_auth, listener) => {
    mockListener = listener;
  },
}));
jest.mock('firebase/analytics', () => ({ getAnalytics: jest.fn() }));
jest.mock('@c/firebaseConfig', () => ({ firebaseConfig: {} }));

const user = (uid) => ({
  uid,
  photoURL: `/${uid}.png`,
  displayName: `User ${uid}`,
  getIdTokenResult: jest.fn().mockResolvedValue({ token: `${uid}-token` }),
  getIdToken: jest.fn().mockRejectedValue(new Error('unexpected second fetch')),
});

function start() {
  const store = createStore({
    modules: {
      firebaseAuthorization: { ...authorization, namespaced: true },
    },
  });
  const hooks = {};
  plugin({
    $store: store,
    hook: (name, callback) => {
      hooks[name] = callback;
    },
  });
  hooks['app:mounted']();
  return store;
}

beforeEach(() => {
  mockListener = undefined;
  signInWithPopup.mockReset();
});

test('認証ストアにトークンとプロフィールを反映し、ログアウトで消去する', async () => {
  const store = start();
  const account = user('member');
  await mockListener(account);
  expect(store.state.firebaseAuthorization).toEqual({
    userId: 'member',
    idToken: 'member-token',
    iconImageUrl: '/member.png',
    displayedName: 'User member',
  });
  expect(account.getIdToken).not.toHaveBeenCalled();
  await mockListener(null);
  expect(store.state.firebaseAuthorization).toEqual({
    userId: null,
    idToken: null,
    iconImageUrl: null,
    displayedName: null,
  });
});

test('遅い前ユーザーの同期は現在のユーザーを上書きしない', async () => {
  const store = start();
  const first = user('first');
  let finish;
  first.getIdTokenResult.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const pending = mockListener(first);
  await mockListener(user('second'));
  finish({ token: 'first-token' });
  await pending;
  expect(store.state.firebaseAuthorization.userId).toBe('second');
  expect(store.state.firebaseAuthorization.idToken).toBe('second-token');
});

test('ログイン完了がログアウト後に届いても状態を戻さない', async () => {
  const store = start();
  let finishLogin;
  signInWithPopup.mockImplementation(
    () =>
      new Promise((resolve) => {
        finishLogin = resolve;
      }),
  );
  const pending = store.dispatch('firebaseAuthorization/loginByGoogle');
  await mockListener(user('stale'));
  await mockListener(null);
  finishLogin({ user: user('stale') });
  await pending;
  expect(store.state.firebaseAuthorization.userId).toBeNull();
  expect(store.state.firebaseAuthorization.idToken).toBeNull();
});
