// @vitest-environment node
import 'reflect-metadata';
import express from 'express';
import { getAuth } from 'firebase-admin/auth';
import { appContainer } from '../../server/common/dependencyInjection/inversify.config';
import { types } from '../../server/common/dependencyInjection/types';
import { ApiResponseHandlerImpl } from '../../server/common/apiResponse/apiResponseHandler';
import { catchError } from '../../server/common/middleware/appErrorHandler';
import { companyRouter } from '../../server/feature/company/controller';

vi.mock('firebase-admin/auth', () => ({ getAuth: vi.fn() }));
vi.mock('../../server/common/dependencyInjection/inversify.config', () => ({
  appContainer: { get: vi.fn() },
}));

// ルート、入力検査、エラー変換は本物を使い、gBizINFOとDBを使うサービスだけを差し替える
const service = { getCompanies: vi.fn() };
let server;
let base;

beforeAll(async () => {
  const app = express();
  app.use('/api/v1', companyRouter);
  app.use(catchError);
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api/v1`;
});
beforeEach(() => {
  vi.clearAllMocks();
  getAuth.mockReturnValue({
    verifyIdToken: () => Promise.reject(new Error('no token')),
  });
  service.getCompanies.mockResolvedValue({ companies: [] });
  appContainer.get.mockImplementation((type) => {
    if (type === types.ApiResponseHandler) {
      return new ApiResponseHandlerImpl();
    }
    if (type === types.LogHandler) {
      return { error: vi.fn() };
    }
    if (type === types.CompanyService) {
      return service;
    }
    throw new Error(`Unexpected dependency ${String(type)}`);
  });
});
afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test.each(['', 'ふくい'])('会社名「%s」で検索できる', async (companyName) => {
  const response = await fetch(
    `${base}/companies/?companyName=${encodeURIComponent(companyName)}`,
  );
  expect(response.status).toBe(200);
  expect(service.getCompanies).toHaveBeenCalledWith({
    companyName,
    userId: '',
  });
});

test.each([
  ['会社名がない', ''],
  ['会社名が複数ある', '?companyName=a&companyName=b'],
])('%s検索は400で拒否し、会社を検索しない', async (_, query) => {
  const response = await fetch(`${base}/companies/${query}`);
  expect(response.status).toBe(400);
  expect((await response.json()).messages).toEqual([
    { message: '会社名は文字を入力してください。' },
  ]);
  expect(service.getCompanies).not.toHaveBeenCalled();
});
