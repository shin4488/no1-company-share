const test = require('node:test');
const assert = require('node:assert/strict');

process.env.GCLOUD_PROJECT = 'demo-scheduled-update';
const axios = require('axios');
const { scheduledCompanyMasterUpdate } = require('../lib/index.js');

test('毎日日本時間0時の第1世代スケジュールを維持する', () => {
  const trigger = scheduledCompanyMasterUpdate.__trigger;
  assert.equal(trigger.schedule.schedule, '0 0 * * *');
  assert.equal(trigger.schedule.timeZone, 'Asia/Tokyo');
  assert.equal(trigger.eventTrigger.eventType, 'google.pubsub.topic.publish');
  assert.deepEqual(scheduledCompanyMasterUpdate.__endpoint.secretEnvironmentVariables.map((secret) => secret.key), ['COMPANY_UPDATE_SECRET']);
});

test('企業更新APIに一度PUTして完了を待つ', async (t) => {
  process.env.COMPANY_UPDATE_SECRET = 'test-secret';
  t.after(() => { delete process.env.COMPANY_UPDATE_SECRET; });
  const calls = [];
  const original = axios.put;
  t.after(() => {
    axios.put = original;
  });
  let finish;
  axios.put = (...args) => {
    calls.push(args);
    return new Promise((resolve) => {
      finish = resolve;
    });
  };
  let completed = false;
  const running = scheduledCompanyMasterUpdate.run({}).then(() => {
    completed = true;
  });
  assert.deepEqual(calls, [[
    'https://f1c.biz/api/v1/companies/',
    undefined,
    { headers: { 'X-Company-Update-Token': 'test-secret' }, timeout: 45000 },
  ]]);
  await Promise.resolve();
  assert.equal(completed, false);
  finish({ status: 200, data: 'test response' });
  await running;
  assert.equal(completed, true);
});

test('APIの失敗を握りつぶさず呼び出し元に返す', async (t) => {
  process.env.COMPANY_UPDATE_SECRET = 'test-secret';
  t.after(() => { delete process.env.COMPANY_UPDATE_SECRET; });
  const original = axios.put;
  t.after(() => {
    axios.put = original;
  });
  const error = new Error('test-secret must not be logged');
  axios.put = async () => {
    throw error;
  };
  await assert.rejects(
    scheduledCompanyMasterUpdate.run({}),
    (actual) => actual.message === 'Company image update failed',
  );
});

test('秘密がなければ外部APIを呼ばない', async (t) => {
  delete process.env.COMPANY_UPDATE_SECRET;
  const original = axios.put;
  let called = false;
  t.after(() => { axios.put = original; });
  axios.put = async () => { called = true; };
  await assert.rejects(scheduledCompanyMasterUpdate.run({}), /secret is unavailable/);
  assert.equal(called, false);
});
