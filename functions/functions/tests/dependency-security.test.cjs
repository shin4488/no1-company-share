const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const { Readable } = require('node:stream');
const { createRequire } = require('node:module');
const { test } = require('node:test');

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

test('Storage transport builds a multipart body with a valid UUID boundary', async (t) => {
  // Receive the upload on a local server so the test needs no external network.
  let captured;
  const server = http.createServer(async (request, response) => {
    let body = '';
    for await (const chunk of request) {
      body += chunk;
    }
    captured = { headers: request.headers, body };
    response.end('ok');
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => server.close());
  const { teenyRequest } = require('teeny-request');
  await new Promise((resolve, reject) => {
    teenyRequest(
      {
        uri: `http://127.0.0.1:${server.address().port}/upload`,
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
  const boundary = captured.headers['content-type'].split('boundary=')[1];
  assert.match(boundary, uuidPattern);
  assert.ok(captured.body.includes(`--${boundary}\r\n`));
  assert.ok(captured.body.includes('企業情報'));
  assert.ok(captured.body.endsWith(`--${boundary}--`));
});

test('UUID used by the Functions Framework rejects writes outside a caller-provided buffer', () => {
  const uuid = createRequire(require.resolve('cloudevents'))('uuid');
  assert.match(uuid.v4(), uuidPattern);
  assert.throws(
    () => uuid.v5('company', uuid.v5.DNS, new Uint8Array(8)),
    RangeError,
  );
});
