const assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const { createRequire } = require('node:module');
const { test } = require('node:test');

test('Storage transport builds a multipart body with a valid UUID boundary without network access', async (t) => {
  const fromTeeny = createRequire(require.resolve('teeny-request'));
  const fetch = fromTeeny('node-fetch');
  const uuid = fromTeeny('uuid');
  let captured;
  t.mock.method(fetch, 'default', async (url, options) => {
    let body = '';
    for await (const chunk of options.body) {
      body += chunk;
    }
    captured = { headers: options.headers, body };
    return new fetch.Response('ok', { status: 200 });
  });
  const { teenyRequest } = require('teeny-request');
  await new Promise((resolve, reject) => {
    teenyRequest(
      {
        uri: 'https://example.invalid/upload',
        method: 'POST',
        headers: {},
        multipart: [
          {
            'Content-Type': 'application/json',
            body: '{"name":"company.txt"}',
          },
          { 'Content-Type': 'text/plain', body: Readable.from(['企業情報']) },
        ],
      },
      (error) => (error ? reject(error) : resolve()),
    );
  });
  const boundary = captured.headers['Content-Type'].split('boundary=')[1];
  assert.equal(uuid.validate(boundary), true);
  assert.equal(uuid.version(boundary), 4);
  assert.ok(captured.body.includes(`--${boundary}\r\n`));
  assert.ok(captured.body.includes('企業情報'));
  assert.ok(captured.body.endsWith(`--${boundary}--`));
});

test('UUID rejects writes outside a caller-provided buffer', () => {
  const uuid = createRequire(require.resolve('teeny-request'))('uuid');
  assert.throws(
    () => uuid.v5('company', uuid.v5.DNS, new Uint8Array(8)),
    RangeError,
  );
});
