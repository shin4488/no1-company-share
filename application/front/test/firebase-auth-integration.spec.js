import { createPinia } from 'pinia';
import { signInWithPopup } from 'firebase/auth';
import plugin from '../plugins/03.firebase.client';
import { useFirebaseAuthorizationStore } from '../store/firebaseAuthorization';

let mockListener;
vi.mock('firebase/app', () => ({ getApps: () => ['app'] }));
vi.mock('firebase/auth', () => ({
  getAuth: () => ({}),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: (_auth, listener) => {
    mockListener = listener;
  },
}));
vi.mock('firebase/analytics', () => ({ getAnalytics: vi.fn() }));
vi.mock('@c/firebaseConfig', () => ({ firebaseConfig: {} }));

// IDトークンは、どちらの取得方法でも同じ値が同じ時点で届く
const user = (uid, token = Promise.resolve(`${uid}-token`)) => ({
  uid,
  photoURL: `/${uid}.png`,
  displayName: `User ${uid}`,
  getIdToken: () => token,
  getIdTokenResult: async () => ({ token: await token }),
});

function start() {
  const store = useFirebaseAuthorizationStore(createPinia());
  const hooks = {};
  plugin({
    $accessor: { firebaseAuthorization: store },
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
  await mockListener(user('member'));
  expect(store.userInfoComputed).toEqual({
    userId: 'member',
    idToken: 'member-token',
    iconImageUrl: '/member.png',
    displayedName: 'User member',
  });
  await mockListener(null);
  expect(store.userInfoComputed).toEqual({
    userId: null,
    idToken: null,
    iconImageUrl: null,
    displayedName: null,
  });
});

test('遅い前ユーザーの同期は現在のユーザーを上書きしない', async () => {
  const store = start();
  let finish;
  const firstToken = new Promise((resolve) => {
    finish = resolve;
  });
  const pending = mockListener(user('first', firstToken));
  await mockListener(user('second'));
  finish('first-token');
  await pending;
  expect(store.userId).toBe('second');
  expect(store.idToken).toBe('second-token');
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
  const pending = store.loginByGoogle();
  await mockListener(user('stale'));
  await mockListener(null);
  finishLogin({ user: user('stale') });
  await pending;
  expect(store.userId).toBeNull();
  expect(store.idToken).toBeNull();
});
