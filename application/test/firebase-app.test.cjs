const assert = require('node:assert/strict');
const path = require('node:path');
const { afterEach, beforeEach, mock, test } = require('node:test');
const { deleteApp, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

require('module-alias').addAlias('@c', path.join(__dirname, '../common'));
const load = require('jiti')(__filename);
const { getFirebaseApp } = load('../server/firebaseApp.ts');
const { firebaseConfig } = load('../common/firebaseConfig.js');
let projectEnvironment;

beforeEach(() => {
  projectEnvironment = {
    GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT,
    GCLOUD_PROJECT: process.env.GCLOUD_PROJECT,
  };
  delete process.env.GOOGLE_CLOUD_PROJECT;
  delete process.env.GCLOUD_PROJECT;
});

afterEach(async () => {
  mock.restoreAll();
  await Promise.all(getApps().map((app) => deleteApp(app)));
  for (const [key, value] of Object.entries(projectEnvironment)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

function authWithoutCloudProject() {
  const app = getFirebaseApp();
  // SDKのトークン検証は実物を使い、クラウド環境への問い合わせだけを禁止する。
  mock.method(app.options.credential, 'getProjectId', () =>
    Promise.reject(new Error('Cloud project discovery is unavailable locally')),
  );
  return getAuth(app);
}

test('クラウド資格情報なしでもIDトークンの検証処理に進める', async () => {
  await assert.rejects(
    authWithoutCloudProject().verifyIdToken('invalid-token'),
    { code: 'auth/argument-error' },
  );
});

test('別Firebaseプロジェクト向けのIDトークンを拒否する', async () => {
  const encode = (value) =>
    Buffer.from(JSON.stringify(value)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const token = [
    encode({ alg: 'RS256', kid: 'fixture-key' }),
    encode({
      aud: 'another-project',
      iss: 'https://securetoken.google.com/another-project',
      sub: 'fixture-user',
      iat: now,
      exp: now + 3600,
      auth_time: now,
    }),
    'fixture-signature',
  ].join('.');
  await assert.rejects(authWithoutCloudProject().verifyIdToken(token), {
    code: 'auth/argument-error',
    message: new RegExp(firebaseConfig.projectId),
  });
});

test('SSRとAPIの初期化で同じFirebaseアプリを使う', () => {
  assert.equal(getFirebaseApp(), getFirebaseApp());
  assert.equal(getApps().length, 1);
});
