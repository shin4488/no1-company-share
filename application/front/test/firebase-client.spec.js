import { createPinia } from 'pinia';
import plugin from '../plugins/03.firebase.client';
import { showError } from '#app';
import { useFirebaseAuthorizationStore } from '../store/firebaseAuthorization';

let mockAuthListener;
let mockAuthError;
vi.mock('firebase/app', () => ({
  getApps: () => ['app'],
  initializeApp: vi.fn(),
}));
vi.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: null }),
  onAuthStateChanged: (_auth, listener, onError) => {
    mockAuthListener = listener;
    mockAuthError = onError;
  },
}));
vi.mock('firebase/analytics', () => ({ getAnalytics: vi.fn() }));
vi.mock('@c/firebaseConfig', () => ({
  firebaseConfig: { projectId: 'demo-test' },
}));

const user = (uid) => {
  const token = Promise.resolve(`${uid}-token`);
  return {
    uid,
    photoURL: `/${uid}.png`,
    displayName: uid,
    getIdToken: () => token,
    getIdTokenResult: async () => ({ token: await token }),
  };
};

function start() {
  const store = useFirebaseAuthorizationStore(createPinia());
  const hooks = {};
  plugin({
    $accessor: { firebaseAuthorization: store },
    hook: (name, callback) => {
      hooks[name] = callback;
    },
  });
  return { store, mount: () => hooks['app:mounted']() };
}

beforeEach(() => {
  mockAuthListener = undefined;
  mockAuthError = undefined;
  showError.mockClear();
});

test('Nuxtアプリの描画後にFirebase認証の購読を始める', async () => {
  const { store, mount } = start();
  expect(mockAuthListener).toBeUndefined();
  mount();
  await mockAuthListener(user('member'));
  expect(store.userIdComputed).toBe('member');
});

test('認証状態を確認できないときはエラーを表示する', () => {
  start().mount();
  mockAuthError(new Error('offline'));
  expect(showError).toHaveBeenCalledWith(
    expect.objectContaining({ statusCode: 503 }),
  );
});
