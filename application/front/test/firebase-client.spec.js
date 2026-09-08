import plugin from '../plugins/firebase/client';
const listeners = [];
const auth = { currentUser: null };
jest.mock('firebase/app', () => ({
  getApps: () => ['app'],
  initializeApp: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  getAuth: () => auth,
  onAuthStateChanged: (_auth, listener) => {
    listeners.push(listener);
  },
}));
jest.mock('firebase/analytics', () => ({ getAnalytics: jest.fn() }));
jest.mock('@c/firebaseConfig', () => ({
  firebaseConfig: { projectId: 'demo-test' },
}));
test('初期認証を待ち、ログイン・ログアウトの状態をストアへ通知する', async () => {
  const dispatch = jest.fn().mockResolvedValue(undefined);
  const inject = jest.fn();
  let ready = false;
  const pending = plugin({ store: { dispatch } }, inject).then(() => {
    ready = true;
  });
  await Promise.resolve();
  expect(ready).toBe(false);
  expect(inject).toHaveBeenCalledWith('fire', { auth });
  await listeners[0](null);
  await pending;
  expect(dispatch).toHaveBeenLastCalledWith(
    'firebaseAuthorization/onAuthStateChangedAction',
    { authUser: null, claims: null },
  );
  const user = {
    uid: 'u',
    getIdTokenResult: jest.fn().mockResolvedValue({ claims: { name: 'test' } }),
  };
  await listeners[0](user);
  expect(user.getIdTokenResult).toHaveBeenCalledWith(true);
  expect(dispatch).toHaveBeenLastCalledWith(
    'firebaseAuthorization/onAuthStateChangedAction',
    { authUser: user, claims: { name: 'test' } },
  );
  await listeners[0](null);
  expect(dispatch).toHaveBeenLastCalledWith(
    'firebaseAuthorization/onAuthStateChangedAction',
    { authUser: null, claims: null },
  );
});
