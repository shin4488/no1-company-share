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
});

test('企業更新APIに一度PUTして完了を待つ', async (t) => {
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
  assert.deepEqual(calls, [['https://f1c.jp.net/api/v1/companies/']]);
  await Promise.resolve();
  assert.equal(completed, false);
  finish({ status: 200, data: 'test response' });
  await running;
  assert.equal(completed, true);
});

test('APIの失敗を握りつぶさず呼び出し元に返す', async (t) => {
  const original = axios.put;
  t.after(() => {
    axios.put = original;
  });
  const error = new Error('test upstream failure');
  axios.put = async () => {
    throw error;
  };
  await assert.rejects(
    scheduledCompanyMasterUpdate.run({}),
    (actual) => actual === error,
  );
});
