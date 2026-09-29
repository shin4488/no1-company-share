import plugin from '../plugins/03.firebase.client';
import { showError } from '#app';

let mockAuthListener;
let mockAuthError;
const mockAuth = { currentUser: null };
jest.mock('firebase/app', () => ({
  getApps: () => ['app'],
  initializeApp: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  getAuth: () => mockAuth,
  onAuthStateChanged: (_auth, listener, onError) => {
    mockAuthListener = listener;
    mockAuthError = onError;
  },
}));
jest.mock('firebase/analytics', () => ({ getAnalytics: jest.fn() }));
jest.mock('@c/firebaseConfig', () => ({
  firebaseConfig: { projectId: 'demo-test' },
}));

const user = (uid) => ({
  uid,
  photoURL: `/${uid}.png`,
  displayName: uid,
  getIdTokenResult: jest.fn().mockResolvedValue({ token: `${uid}-token` }),
});

function start() {
  const dispatch = jest.fn().mockResolvedValue(undefined);
  const hooks = {};
  const store = { dispatch };
  const result = plugin({
    $store: store,
    hook: (name, callback) => {
      hooks[name] = callback;
    },
  });
  expect(result.provide.fire.auth).toBe(mockAuth);
  expect(store.$fire).toBe(result.provide.fire);
  expect(mockAuthListener).toBeUndefined();
  hooks['app:mounted']();
  return { dispatch };
}

beforeEach(() => {
  mockAuthListener = undefined;
  mockAuthError = undefined;
  showError.mockClear();
});

test('描画後にFirebase認証を購読しトークンを一度だけ取得する', async () => {
  const { dispatch } = start();
  const account = user('member');
  await mockAuthListener(account);
  expect(account.getIdTokenResult).toHaveBeenCalledWith(true);
  expect(dispatch).toHaveBeenCalledWith(
    'firebaseAuthorization/onAuthStateChangedAction',
    {
      authUser: {
        uid: 'member',
        idToken: 'member-token',
        photoURL: '/member.png',
        displayName: 'member',
      },
    },
  );
  await mockAuthListener(null);
  expect(dispatch).toHaveBeenLastCalledWith(
    'firebaseAuthorization/onAuthStateChangedAction',
    { authUser: null },
  );
});

test('古い認証結果が後で届いても新しいユーザーを上書きしない', async () => {
  const { dispatch } = start();
  const first = user('first');
  let finish;
  first.getIdTokenResult.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const pending = mockAuthListener(first);
  await mockAuthListener(user('second'));
  finish({ token: 'first-token' });
  await pending;
  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch.mock.calls[0][1].authUser.uid).toBe('second');
});

test('認証状態を確認できないときはエラーを表示する', () => {
  start();
  mockAuthError(new Error('offline'));
  expect(showError).toHaveBeenCalledWith(
    expect.objectContaining({ statusCode: 503 }),
  );
});
