import { navigateTo, useNuxtApp } from '#app';
import routerMiddleware from '../middleware/router.global';

beforeEach(() => jest.clearAllMocks());

test.each([
  ['/login', 'loginByGoogle'],
  ['/logout', 'logout'],
])('%s は認証操作の完了後にホームへ戻る', async (path, action) => {
  let finish;
  const pending = new Promise((resolve) => {
    finish = resolve;
  });
  const authorization = {
    loginByGoogle: jest.fn(() => pending),
    logout: jest.fn(() => pending),
  };
  useNuxtApp.mockReturnValue({
    $accessor: { firebaseAuthorization: authorization },
  });

  const navigation = routerMiddleware({ path });
  expect(authorization[action]).toHaveBeenCalledTimes(1);
  expect(navigateTo).not.toHaveBeenCalled();
  finish();
  await navigation;
  expect(navigateTo).toHaveBeenCalledWith('/home');
  const otherAction = action === 'logout' ? 'loginByGoogle' : 'logout';
  expect(authorization[otherAction]).not.toHaveBeenCalled();
});

test.each(['/home', '/usage'])(
  '%s への遷移では認証操作を行わない',
  async (path) => {
    const authorization = {
      userIdComputed: null,
      loginByGoogle: jest.fn(),
      logout: jest.fn(),
    };
    useNuxtApp.mockReturnValue({
      $accessor: { firebaseAuthorization: authorization },
    });

    await routerMiddleware({ path });
    expect(authorization.loginByGoogle).not.toHaveBeenCalled();
    expect(authorization.logout).not.toHaveBeenCalled();
    expect(navigateTo).not.toHaveBeenCalled();
  },
);
