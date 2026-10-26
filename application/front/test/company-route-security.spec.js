// @vitest-environment node
import 'reflect-metadata';
import express from 'express';
import { appContainer } from '../../server/common/dependencyInjection/inversify.config';
import { types } from '../../server/common/dependencyInjection/types';
import { ApiResponseHandlerImpl } from '../../server/common/apiResponse/apiResponseHandler';
import { catchError } from '../../server/common/middleware/appErrorHandler';
import { companyRouter } from '../../server/feature/company/controller';

vi.mock('../../server/common/dependencyInjection/inversify.config', () => ({
  appContainer: { get: vi.fn() },
}));

// ルートと認証は本物を使い、企業画像を取得してDBへ書き込むサービスだけを差し替える
const service = { updateCompanies: vi.fn() };
let server;
let base;
let originalSecret;

beforeAll(async () => {
  originalSecret = process.env.COMPANY_UPDATE_SECRET;
  const app = express();
  app.use('/api/v1', companyRouter);
  app.use(catchError);
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api/v1`;
});
beforeEach(() => {
  vi.clearAllMocks();
  service.updateCompanies.mockResolvedValue(undefined);
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
afterEach(() => {
  if (originalSecret === undefined) {
    delete process.env.COMPANY_UPDATE_SECRET;
  } else {
    process.env.COMPANY_UPDATE_SECRET = originalSecret;
  }
});
afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

const updateCompanies = (token) =>
  fetch(`${base}/companies/`, {
    method: 'PUT',
    headers: token === undefined ? {} : { 'X-Company-Update-Token': token },
  });

test.each([
  ['サーバーに秘密が設定されていない', undefined, 'configured-secret'],
  ['トークンがない', 'configured-secret', undefined],
  ['トークンが違う', 'configured-secret', 'wrong'],
  ['トークンが前方だけ一致する', 'configured-secret', 'configured'],
])(
  '会社画像の更新は%sとき403で拒否し、更新しない',
  async (_, configured, supplied) => {
    if (configured === undefined) {
      delete process.env.COMPANY_UPDATE_SECRET;
    } else {
      process.env.COMPANY_UPDATE_SECRET = configured;
    }
    const response = await updateCompanies(supplied);
    expect(response.status).toBe(403);
    expect(service.updateCompanies).not.toHaveBeenCalled();
  },
);

test('会社画像の更新は設定された秘密と同じトークンのときだけ行う', async () => {
  process.env.COMPANY_UPDATE_SECRET = 'configured-secret';
  const response = await updateCompanies('configured-secret');
  expect(response.status).toBe(200);
  expect(service.updateCompanies).toHaveBeenCalledTimes(1);
});
