// @vitest-environment node
import { createPinia } from 'pinia';
import { useRequestEvent } from '#app';
import ssrAuthentication from '../../server/middleware/firebase-ssr';
import storePlugin from '../plugins/01.store';

vi.mock('firebase-admin/app', () => ({
  getApps: vi.fn(() => ['app']),
  initializeApp: vi.fn(),
}));
vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({ verifyIdToken: mockVerifyToken }),
}));
vi.mock('../../common/firebaseConfig', () => ({
  firebaseConfig: { projectId: 'demo-test' },
}));
const mockVerifyToken = vi.fn();

const signedOut = {
  userId: null,
  idToken: null,
  iconImageUrl: null,
  displayedName: null,
};

// 1件のHTML要求について、サーバーの認証からSSRのストア初期化までを通す
async function renderInitialUser(authorization, path = '/home') {
  const req = { headers: authorization ? { authorization } : {} };
  const event = { path, node: { req, res: {} }, context: {} };
  await ssrAuthentication(event);
  useRequestEvent.mockReturnValue(event);
  const { provide } = await storePlugin({ $pinia: createPinia() });
  return provide.accessor.firebaseAuthorization.userInfoComputed;
}

describe('SSRの初期表示の認証', () => {
  beforeEach(() => {
    mockVerifyToken.mockReset();
    mockVerifyToken.mockImplementation((token) =>
      token === 'test-token'
        ? Promise.resolve({
            uid: 'user-a',
            name: '表示名',
            picture: 'https://example.invalid/user-a.png',
            email: 'test@example.invalid',
            email_verified: true,
          })
        : Promise.reject(new Error('invalid token')),
    );
  });
  afterEach(() => {
    useRequestEvent.mockReset();
  });

  test('Bearerで送られた検証済みのIDトークンのユーザーで初期表示する', async () => {
    expect(await renderInitialUser('Bearer test-token')).toEqual({
      userId: 'user-a',
      idToken: 'test-token',
      iconImageUrl: 'https://example.invalid/user-a.png',
      displayedName: '表示名',
    });
  });

  test.each([undefined, '', 'test-token', 'Bearer invalid'])(
    '認証ヘッダー %s の要求は未ログインとして初期表示する',
    async (authorization) => {
      expect(await renderInitialUser(authorization)).toEqual(signedOut);
    },
  );

  test('UIDのない検証結果をログイン済みにしない', async () => {
    mockVerifyToken.mockResolvedValue({});
    expect(await renderInitialUser('Bearer test-token')).toEqual(signedOut);
  });

  test('前の要求のユーザーを次の要求の初期表示に引き継がない', async () => {
    expect((await renderInitialUser('Bearer test-token')).userId).toBe(
      'user-a',
    );
    expect(await renderInitialUser(undefined)).toEqual(signedOut);
  });
});
