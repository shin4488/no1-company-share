const assert = require('node:assert/strict');
const { test } = require('node:test');
const { get: httpGet } = require('node:http');
const { get: httpsGet } = require('node:https');
const { X509Certificate, createPrivateKey } = require('node:crypto');
const { mkdtemp, writeFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { execFileSync } = require('node:child_process');
const { listen } = require('listhen');
const { resolveCertificate } = require('listhen/native-tls.cjs');

const options = {
  hostname: '127.0.0.1',
  port: 0,
  isTest: true,
  autoClose: false,
};
const handle = (_request, response) => response.end('listener works');
function request(get, url, settings = {}) {
  return new Promise((resolve, reject) => {
    get(url, settings, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => resolve({ status: response.statusCode, body }));
    }).on('error', reject);
  });
}

// Explicitly trust only the generated test certificate, never disable TLS checks.
function trust(cert) {
  return { ca: cert };
}

test('ESM and CommonJS listener imports preserve HTTP', async () => {
  for (const api of [require('listhen'), await import('listhen')]) {
    const listener = await api.listen(handle, options);
    try {
      assert.equal(listener.https, false);
      assert.deepEqual(await request(httpGet, listener.url), {
        status: 200,
        body: 'listener works',
      });
    } finally {
      await listener.close();
    }
  }
  assert.throws(() => require.resolve('node-forge'), {
    code: 'MODULE_NOT_FOUND',
  });
});

test('generated HTTPS preserves SANs, RSA strength, validity and encrypted private keys', async () => {
  const tls = await resolveCertificate({
    passphrase: 'local fixture passphrase',
    signingKeyPassphrase: 'local ca passphrase',
    validityDays: 2,
  });
  const cert = new X509Certificate(tls.cert);
  assert.equal(cert.checkHost('localhost'), 'localhost');
  assert.equal(cert.checkIP('127.0.0.1'), '127.0.0.1');
  assert.equal(cert.checkIP('::1'), '::1');
  assert.equal(cert.ca, false);
  assert.equal(
    createPrivateKey({ key: tls.key, passphrase: tls.passphrase })
      .asymmetricKeyDetails.modulusLength,
    2048,
  );
  assert.ok(
    Math.abs(
      Date.parse(cert.validTo) - Date.parse(cert.validFrom) - 2 * 86400000,
    ) < 1000,
  );
  assert.match(tls.key, /BEGIN ENCRYPTED PRIVATE KEY/);
  const listener = await listen(handle, { ...options, https: tls });
  try {
    assert.deepEqual(await request(httpsGet, listener.url, trust(tls.cert)), {
      status: 200,
      body: 'listener works',
    });
    await assert.rejects(request(httpsGet, listener.url));
  } finally {
    await listener.close();
  }
});

test('custom SANs exclude defaults and PEM files and PFX keystores work', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'codex-no1-tls-'));
  try {
    const tls = await resolveCertificate({
      domains: ['127.0.0.1', 'fixture.example'],
      commonName: 'fixture.example',
    });
    const cert = new X509Certificate(tls.cert);
    assert.equal(cert.checkHost('fixture.example'), 'fixture.example');
    assert.equal(cert.checkHost('localhost'), undefined);
    const key = join(directory, 'key.pem');
    const certificate = join(directory, 'cert.pem');
    const pfx = join(directory, 'test.pfx');
    await writeFile(key, tls.key, { mode: 0o600 });
    await writeFile(certificate, tls.cert);
    execFileSync('openssl', [
      'pkcs12',
      '-export',
      '-inkey',
      key,
      '-in',
      certificate,
      '-out',
      pfx,
      '-passout',
      'pass:fixture-pfx',
    ]);
    for (const https of [
      { key, cert: certificate },
      { pfx, passphrase: 'fixture-pfx' },
    ]) {
      const listener = await listen(handle, { ...options, https });
      try {
        assert.equal(
          (await request(httpsGet, listener.url, trust(tls.cert))).status,
          200,
        );
      } finally {
        await listener.close();
      }
    }
    await assert.rejects(
      listen(handle, { ...options, https: { pfx, passphrase: 'wrong' } }),
    );
    await assert.rejects(
      listen(handle, {
        ...options,
        https: { key: 'missing-key.pem', cert: certificate },
      }),
    );
    await writeFile(pfx, 'malformed keystore');
    await assert.rejects(listen(handle, { ...options, https: { pfx } }));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
