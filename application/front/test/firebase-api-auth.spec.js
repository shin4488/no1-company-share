import { authorizationFirebaseUser } from '../../server/common/middleware/firebaseAuthorization';

const mockVerifyToken = jest.fn();
jest.mock('firebase-admin/auth', () => ({
  getAuth: () => ({ verifyIdToken: mockVerifyToken }),
}));

describe('APIのFirebase認証', () => {
  beforeEach(() => mockVerifyToken.mockReset());

  test.each(['Bearer test-token', 'bearer test-token', 'test-token'])(
    '%s からIDトークンを検証してユーザーを設定する',
    async (authorization) => {
      mockVerifyToken.mockResolvedValue({ uid: 'user-a' });
      const response = { locals: {} };
      const next = jest.fn();

      await authorizationFirebaseUser()(
        { headers: { authorization } },
        response,
        next,
      );

      expect(mockVerifyToken).toHaveBeenCalledWith('test-token');
      expect(response.locals.firebaseUserId).toBe('user-a');
      expect(next).toHaveBeenCalledWith();
    },
  );

  test('無効なトークンは認証必須APIで拒否する', async () => {
    mockVerifyToken.mockRejectedValue(new Error('invalid'));
    const response = { locals: {} };
    const next = jest.fn();

    await authorizationFirebaseUser()(
      { headers: { authorization: 'Bearer invalid' } },
      response,
      next,
    );

    expect(response.locals.firebaseUserId).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0].errorMessages).toEqual([
      'ログインしてください。',
    ]);
  });

  test('認証任意のAPIはトークンがなくても続行する', async () => {
    mockVerifyToken.mockRejectedValue(new Error('missing'));
    const response = { locals: {} };
    const next = jest.fn();

    await authorizationFirebaseUser(false)({ headers: {} }, response, next);

    expect(response.locals.firebaseUserId).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });
});
