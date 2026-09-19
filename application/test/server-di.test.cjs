const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');
require('reflect-metadata');
const root = path.resolve(__dirname, '..');
require('module-alias').addAliases({
  '@s': path.join(root, 'server'),
  '@c': path.join(root, 'common'),
});
// Exercise the same TypeScript runtime loader as Nuxt server middleware, not ts-jest.
const load = require('jiti')(__filename);
const { appContainer } = load(
  path.join(root, 'server/common/dependencyInjection/inversify.config.ts'),
);
const { types } = load(
  path.join(root, 'server/common/dependencyInjection/types.ts'),
);

test('runtime DI creates isolated validation handlers and preserves validation errors', () => {
  const first = appContainer.get(types.BadParameterErrorHandler);
  first.throwIfHasError();
  first.addMessage('invalid input');
  assert.throws(
    () => first.throwIfHasError(),
    (error) =>
      error.name === 'BadParameterError' &&
      error.errorMessages.includes('invalid input'),
  );
  appContainer.get(types.BadParameterErrorHandler).throwIfHasError();
});
