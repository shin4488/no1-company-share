const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { inspect } = require('node:util');

process.env.GCLOUD_PROJECT = 'demo-scheduled-update';
const axios = require('axios');
const { scheduledCompanyMasterUpdate } = require('../lib/index.js');

const functionsDir = path.join(__dirname, '..');
const companyUpdateUrl = 'https://f1c.biz/api/v1/companies/';

// Firebase CLIが配備時に読む関数定義を、SDKのコマンドで書き出して確かめる。
function deployedEndpoint(t) {
  const sdkDir = path.join(functionsDir, 'node_modules/firebase-functions');
  const { bin } = JSON.parse(
    fs.readFileSync(path.join(sdkDir, 'package.json'), 'utf8'),
  );
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'no1-functions-manifest-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const output = path.join(dir, 'manifest.json');
  execFileSync(
    process.execPath,
    [path.join(sdkDir, bin['firebase-functions']), functionsDir],
    {
      env: { ...process.env, FUNCTIONS_MANIFEST_OUTPUT_PATH: output },
      stdio: 'pipe',
    },
  );
  return JSON.parse(fs.readFileSync(output, 'utf8')).endpoints
    .scheduledCompanyMasterUpdate;
}

// HTTP送信の直前で要求を受け取り、外部APIへは接続しない。
function fakeCompanyUpdateApi(t, respond) {
  const requests = [];
  const original = axios.defaults.adapter;
  t.after(() => {
    axios.defaults.adapter = original;
  });
  axios.defaults.adapter = (config) => {
    requests.push({
      method: config.method,
      url: config.url,
      token: config.headers.get('X-Company-Update-Token'),
      timeout: config.timeout,
    });
    return respond(config);
  };
  return requests;
}

function useSecret(t, secret) {
  const original = process.env.COMPANY_UPDATE_SECRET;
  t.after(() => {
    if (original === undefined) {
      delete process.env.COMPANY_UPDATE_SECRET;
    } else {
      process.env.COMPANY_UPDATE_SECRET = original;
    }
  });
  if (secret === undefined) {
    delete process.env.COMPANY_UPDATE_SECRET;
  } else {
    process.env.COMPANY_UPDATE_SECRET = secret;
  }
}

test('毎日日本時間0時に実行する第2世代の関数として、秘密を渡して配備する', (t) => {
  const endpoint = deployedEndpoint(t);
  assert.equal(endpoint.platform, 'gcfv2');
  assert.equal(endpoint.scheduleTrigger.schedule, '0 0 * * *');
  assert.equal(endpoint.scheduleTrigger.timeZone, 'Asia/Tokyo');
  assert.deepEqual(
    endpoint.secretEnvironmentVariables.map((secret) => secret.key),
    ['COMPANY_UPDATE_SECRET'],
  );
});

test('企業更新APIに一度PUTして完了を待つ', async (t) => {
  useSecret(t, 'test-secret');
  let finish;
  const requests = fakeCompanyUpdateApi(
    t,
    (config) =>
      new Promise((resolve) => {
        finish = () => resolve({ status: 200, data: '', headers: {}, config });
      }),
  );
  let completed = false;
  const running = scheduledCompanyMasterUpdate.run({}).then(() => {
    completed = true;
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(requests.length, 1);
  const [request] = requests;
  assert.equal(request.method, 'put');
  assert.equal(request.url, companyUpdateUrl);
  assert.equal(request.token, 'test-secret');
  // Functionの制限時間より前に打ち切り、失敗として記録できるようにする
  assert.ok(request.timeout > 0);
  assert.ok(request.timeout < deployedEndpoint(t).timeoutSeconds * 1000);
  assert.equal(completed, false);
  finish();
  await running;
  assert.equal(completed, true);
});

test('APIの失敗を握りつぶさず、秘密を含まない例外で呼び出し元に返す', async (t) => {
  useSecret(t, 'test-secret');
  fakeCompanyUpdateApi(t, (config) => {
    // Axiosの例外は、送信したヘッダー（秘密を含む）を持つ
    throw new axios.AxiosError(
      'Request failed with status code 503',
      axios.AxiosError.ERR_BAD_RESPONSE,
      config,
      null,
      { status: 503, data: '', headers: {}, config },
    );
  });
  await assert.rejects(scheduledCompanyMasterUpdate.run({}), (error) => {
    assert.ok(error instanceof Error);
    assert.doesNotMatch(inspect(error, { depth: Infinity }), /test-secret/);
    return true;
  });
});

test('秘密がなければ外部APIを呼ばない', async (t) => {
  useSecret(t, undefined);
  const requests = fakeCompanyUpdateApi(t, () => {
    throw new Error('the company update API must not be called');
  });
  await assert.rejects(
    scheduledCompanyMasterUpdate.run({}),
    /secret is unavailable/,
  );
  assert.equal(requests.length, 0);
});
