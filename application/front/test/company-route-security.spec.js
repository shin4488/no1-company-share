/** @jest-environment node */

import { companyRouter } from '../../server/feature/company/controller';

test('会社情報APIは参照だけを公開する', () => {
  const exposedMethods = companyRouter.stack
    .filter((layer) => layer.route?.path === '/companies/')
    .flatMap((layer) => Object.keys(layer.route.methods));

  expect(exposedMethods).toEqual(['get']);
});
