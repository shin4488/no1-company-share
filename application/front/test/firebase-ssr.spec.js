import middleware from '../../server/firebaseSsr';
jest.mock('firebase-admin/app', () => ({
  getApps: jest.fn(() => ['app']),
  initializeApp: jest.fn(),
}));
jest.mock('firebase-admin/auth', () => ({
  getAuth: () => ({ verifyIdToken: mockVerifyToken }),
}));
jest.mock('../../common/firebaseConfig', () => ({
  firebaseConfig: { projectId: 'demo-test' },
}));
const mockVerifyToken = jest.fn();
describe('SSRの認証境界', () => {
  beforeEach(() => mockVerifyToken.mockReset());
  test.each([undefined, '', 'raw-token'])(
    'Bearerなしの要求 %s は未認証として続行する',
    async (authorization) => {
      const res = {};
      const next = jest.fn();
      await middleware({ headers: { authorization } }, res, next);
      expect(mockVerifyToken).not.toHaveBeenCalled();
      expect(res.locals).toBeUndefined();
      expect(next).toHaveBeenCalledTimes(1);
    },
  );
  test('検証されたIDトークンだけをSSRストアへ渡す', async () => {
    const claims = {
      uid: 'user-a',
      name: '表示名',
      email: 'test@example.invalid',
      email_verified: true,
    };
    mockVerifyToken.mockResolvedValue(claims);
    const res = { locals: { existing: true } };
    const next = jest.fn();
    await middleware(
      { headers: { authorization: 'Bearer test-token' } },
      res,
      next,
    );
    expect(mockVerifyToken).toHaveBeenCalledWith('test-token');
    expect(res.locals.existing).toBe(true);
    expect(res.locals.user).toEqual({
      uid: 'user-a',
      displayName: '表示名',
      email: 'test@example.invalid',
      emailVerified: true,
      allClaims: claims,
      idToken: 'test-token',
    });
    expect(next).toHaveBeenCalledTimes(1);
  });
  test('検証失敗やUID欠落を認証済みにしない', async () => {
    for (const valid of [false, true]) {
      if (valid) {
        mockVerifyToken.mockResolvedValue({});
      } else {
        mockVerifyToken.mockRejectedValue(new Error('invalid'));
      }
      const res = {};
      const next = jest.fn();
      await middleware(
        { headers: { authorization: 'Bearer invalid' } },
        res,
        next,
      );
      expect(res.locals).toBeUndefined();
      expect(next).toHaveBeenCalledTimes(1);
    }
  });
  test('別リクエストへ認証情報を引き継がない', async () => {
    mockVerifyToken.mockResolvedValue({ uid: 'first' });
    const first = {};
    const second = {};
    await middleware(
      { headers: { authorization: 'Bearer first' } },
      first,
      () => {},
    );
    await middleware({ headers: {} }, second, () => {});
    expect(first.locals.user.uid).toBe('first');
    expect(second.locals).toBeUndefined();
  });
});
