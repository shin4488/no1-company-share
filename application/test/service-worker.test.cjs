const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const source = fs.readFileSync(
  path.join(__dirname, '../front/static/firebase-auth-sw.js'),
  'utf8',
);

function worker(user) {
  const listeners = {};
  const requests = [];
  const origin = 'https://example.invalid';
  const context = {
    self: {
      location: { origin, protocol: 'https:', hostname: 'example.invalid' },
      addEventListener: (name, handler) => {
        listeners[name] = handler;
      },
    },
    firebase: {
      initializeApp() {},
      auth: () => ({
        onAuthStateChanged(callback) {
          queueMicrotask(() => callback(user));
          return () => {};
        },
      }),
    },
    importScripts() {},
    Headers,
    Request,
    URL,
    clients: { claim() {} },
    fetch: (request) => {
      requests.push(request);
      return Promise.resolve(new Response('ok'));
    },
  };
  vm.runInNewContext(source, context);
  return { listeners, requests, origin };
}

function dispatchFetch(listener, request) {
  let response;
  listener({
    request,
    respondWith(promise) {
      response = promise;
    },
  });
  return response;
}

test('same-origin HTML navigation carries only the current ID token', async () => {
  const { listeners, requests, origin } = worker({
    getIdToken: () => Promise.resolve('fixture-token'),
  });
  const request = new Request(`${origin}/home`, {
    headers: { Accept: 'text/html', Authorization: 'Bearer stale-token' },
  });
  await dispatchFetch(listeners.fetch, request);
  assert.equal(requests.length, 1);
  assert.equal(
    requests[0].headers.get('Authorization'),
    'Bearer fixture-token',
  );
  assert.equal(requests[0].url, `${origin}/home`);
});

test('assets and cross-origin requests remain available to other handlers', () => {
  const { listeners, requests, origin } = worker(null);
  for (const request of [
    new Request(`${origin}/_nuxt/app.js`),
    new Request('https://another.invalid/usage', {
      headers: { Accept: 'text/html' },
    }),
  ]) {
    assert.equal(dispatchFetch(listeners.fetch, request), undefined);
  }
  assert.equal(requests.length, 0);
});
