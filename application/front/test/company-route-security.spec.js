/** @jest-environment node */

import { companyRouter } from '../../server/feature/company/controller';
import { authorizeCompanyUpdate } from '../../server/feature/company/authorizeUpdate';

test('会社画像更新は認証ミドルウェアを通す', () => {
  const routes = companyRouter.stack
    .filter((layer) => layer.route?.path === '/companies/')
    .map((layer) => layer.route);

  expect(routes.map((route) => Object.keys(route.methods))).toEqual([
    ['get'],
    ['put'],
  ]);
  expect(routes[1].stack[0].handle).toBe(authorizeCompanyUpdate);
});

test.each([
  [undefined, undefined, false],
  ['configured-secret', undefined, false],
  ['configured-secret', 'wrong', false],
  ['configured-secret', 'configured-secret', true],
])('会社画像更新の認証', (configured, supplied, authorized) => {
  const original = process.env.COMPANY_UPDATE_SECRET;
  if (configured) {
    process.env.COMPANY_UPDATE_SECRET = configured;
  } else {
    delete process.env.COMPANY_UPDATE_SECRET;
  }
  try {
    const request = { get: () => supplied };
    const response = { sendStatus: jest.fn() };
    const next = jest.fn();
    authorizeCompanyUpdate(request, response, next);
    if (authorized) {
      expect(next).toHaveBeenCalledTimes(1);
      expect(response.sendStatus).not.toHaveBeenCalled();
    } else {
      expect(next).not.toHaveBeenCalled();
      expect(response.sendStatus).toHaveBeenCalledWith(403);
    }
  } finally {
    if (original === undefined) {
      delete process.env.COMPANY_UPDATE_SECRET;
    } else {
      process.env.COMPANY_UPDATE_SECRET = original;
    }
  }
});
