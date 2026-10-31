const test = require('node:test');
const assert = require('node:assert/strict');
const {spawn} = require('node:child_process');
const {once} = require('node:events');
const net = require('node:net');
const path = require('node:path');

async function freePort() {
  const server = net.createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

for (const outcome of ['success', 'reject', 'missing-secret']) {
  test(`実際のFunctions FrameworkでCloud Schedulerからの呼び出しを処理する: ${outcome}`, async (t) => {
    const port = await freePort();
    const env = {
      ...process.env,
      NODE_ENV: 'test',
      GCLOUD_PROJECT: 'demo-scheduled-update',
      COMPANY_UPDATE_SECRET: 'framework-test-secret',
      FRAMEWORK_TEST_OUTCOME: outcome,
    };
    if (outcome === 'missing-secret') {
      delete env.COMPANY_UPDATE_SECRET;
    }
    const child = spawn(process.execPath, [
      '--require', path.join(__dirname, 'fixtures/framework-preload.cjs'),
      path.join(path.dirname(require.resolve('@google-cloud/functions-framework')), 'main.js'),
      '--target=scheduledCompanyMasterUpdate', '--signature-type=http', `--port=${port}`,
    ], {cwd: path.join(__dirname, '..'), env, stdio: ['ignore', 'pipe', 'pipe']});
    let output = '';
    child.stdout.on('data', (data) => { output += data; });
    child.stderr.on('data', (data) => { output += data; });
    t.after(async () => {
      if (child.exitCode === null) {
        const stopped = once(child, 'exit');
        child.kill();
        await stopped;
      }
    });
    await new Promise((resolve, reject) => {
      const ready = () => {
        if (output.includes(`URL: http://localhost:${port}/`)) {
          clearTimeout(timer);
          child.stdout.off('data', ready);
          resolve();
        }
      };
      const timer = setTimeout(() => reject(new Error(`Framework did not start: ${output}`)), 10000);
      child.stdout.on('data', ready);
      child.once('exit', () => {
        clearTimeout(timer);
        reject(new Error(`Framework exited before serving: ${output}`));
      });
    });
    // Cloud Schedulerと同じく、ジョブ名と予定時刻のヘッダーを付けてPOSTする
    const response = await fetch(`http://127.0.0.1:${port}/`, {
      method: 'POST',
      headers: {
        'X-CloudScheduler-JobName': 'firebase-schedule-scheduledCompanyMasterUpdate-us-central1',
        'X-CloudScheduler-ScheduleTime': '2026-10-01T15:00:00Z',
      },
      signal: AbortSignal.timeout(10000),
    });
    const body = await response.text();
    assert.equal(response.status, outcome === 'success' ? 200 : 500, body);
    const apiCalls = [...output.matchAll(/FRAMEWORK_TEST_API_CALL (.+)/g)].map((match) => JSON.parse(match[1]));
    assert.deepEqual(apiCalls, outcome === 'missing-secret' ? [] : [{method: 'put', url: 'https://f1c.biz/api/v1/companies/', hasToken: true}]);
    if (outcome === 'success') {
      assert.match(output, /FRAMEWORK_TEST_API_FINISHED/);
    }
    if (outcome === 'reject') {
      assert.match(body + output, /Company image update failed/);
    }
    if (outcome === 'missing-secret') {
      assert.match(body + output, /secret is unavailable/);
    }
    assert.doesNotMatch(body + output, /framework-test-secret/);
  });
}
