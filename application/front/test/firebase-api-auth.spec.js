// @vitest-environment node
import 'reflect-metadata';
import express, { json } from 'express';
import { appContainer } from '../../server/common/dependencyInjection/inversify.config';
import { types } from '../../server/common/dependencyInjection/types';
import { ApiResponseHandlerImpl } from '../../server/common/apiResponse/apiResponseHandler';
import { catchError } from '../../server/common/middleware/appErrorHandler';
import { companyRouter } from '../../server/feature/company/controller';
import { userRouter } from '../../server/feature/user/controller';

// Firebaseは test-token だけを user-a のIDトークンとして検証する
vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({
    verifyIdToken: (token) =>
      token === 'test-token'
        ? Promise.resolve({ uid: 'user-a' })
        : Promise.reject(new Error('invalid token')),
  }),
}));
vi.mock('../../server/common/dependencyInjection/inversify.config', () => ({
  appContainer: { get: vi.fn() },
}));

// ルート、認証、入力検査、エラー変換は本物を使い、DBと外部APIを使うサービスだけを差し替える
const userService = { save: vi.fn() };
const companyService = { getCompanies: vi.fn() };
let server;
let base;

beforeAll(async () => {
  const app = express();
  app.use(json());
  app.use('/api/v1', userRouter, companyRouter);
  app.use(catchError);
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api/v1`;
});
beforeEach(() => {
  vi.clearAllMocks();
  userService.save.mockResolvedValue(undefined);
  companyService.getCompanies.mockResolvedValue({ companies: [] });
  appContainer.get.mockImplementation((type) => {
    if (type === types.ApiResponseHandler) {
      return new ApiResponseHandlerImpl();
    }
    if (type === types.LogHandler) {
      return { error: vi.fn() };
    }
    if (type === types.UserService) {
      return userService;
    }
    if (type === types.CompanyService) {
      return companyService;
    }
    throw new Error(`Unexpected dependency ${String(type)}`);
  });
});
afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

// 認証が必要なAPIとして、ログイン中のユーザー情報の登録を使う
const saveUser = (headers = {}) =>
  fetch(`${base}/users/`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify({
      iconImageUrl: 'https://example.com/icon.png',
      displayedName: '利用者',
    }),
  });

describe('APIのFirebase認証', () => {
  test.each(['Bearer test-token', 'bearer test-token', 'test-token'])(
    '%s で送られたIDトークンのユーザーとして処理する',
    async (authorization) => {
      const response = await saveUser({ authorization });

      expect(response.status).toBe(200);
      expect(userService.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'user-a' }),
      );
    },
  );

  test('無効なトークンは認証必須APIで401として拒否する', async () => {
    const response = await saveUser({ authorization: 'Bearer invalid' });

    expect(response.status).toBe(401);
    expect((await response.json()).messages).toEqual([
      { message: 'ログインしてください。' },
    ]);
    expect(userService.save).not.toHaveBeenCalled();
  });

  test('認証任意のAPIはトークンがなくても未ログインとして続行する', async () => {
    const response = await fetch(`${base}/companies/?companyName=`);

    expect(response.status).toBe(200);
    expect(companyService.getCompanies).toHaveBeenCalledWith(
      expect.objectContaining({ userId: '' }),
    );
  });
});
