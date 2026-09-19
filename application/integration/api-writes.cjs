const assert = require('node:assert/strict');
const path = require('node:path');
const { Client } = require('pg');
const root = path.resolve(__dirname, '..');
const url = new URL(process.env.NO1_TEST_DATABASE_URL || 'postgres://invalid');
assert.ok(
  ['localhost', '127.0.0.1'].includes(url.hostname) &&
    url.pathname.startsWith('/codex_no1_'),
  'Provide a dedicated local codex_no1_* database',
);
Object.assign(process.env, {
  NODE_ENV: 'test',
  POSTGRES_DATABASE: url.pathname.slice(1),
  POSTGRES_USER_NAME: decodeURIComponent(url.username),
  POSTGRES_PASSWORD: decodeURIComponent(url.password),
  POSTGRES_HOST_NAME: url.hostname,
  POSTGRES_PORT: url.port,
});
require('reflect-metadata');
require('module-alias').addAliases({
  '@s': path.join(root, 'server'),
  '@c': path.join(root, 'common'),
});
const load = require('jiti')(__filename);
const { appContainer } = load(
  path.join(root, 'server/common/dependencyInjection/inversify.config.ts'),
);
const { types } = load(
  path.join(root, 'server/common/dependencyInjection/types.ts'),
);
appContainer.rebind(types.LogHandler).toConstantValue({
  log() {},
  error() {},
  getAccessLoggerMiddleware: () => (_req, _res, next) => next(),
});
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
initializeApp({ projectId: 'demo-local-write-test' });
// Only identity verification is replaced; routes, DI, validation, services and SQL are real.
getAuth().verifyIdToken = (token) => {
  if (!['fixture-owner', 'fixture-other'].includes(token)) {
    return Promise.reject(new Error('invalid test identity'));
  }
  return Promise.resolve({ uid: token });
};
const app = load(path.join(root, 'server/index.ts')).default;
const db = new Client({ connectionString: url.toString() });
let server;
let count = 0;
(async () => {
  await db.connect();
  await db.query(
    "INSERT INTO user_master(id,displayed_name) VALUES ('fixture-owner','Owner'),('fixture-other','Other') ON CONFLICT DO NOTHING",
  );
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/v1`;
  async function call(
    method,
    endpoint,
    body,
    identity = 'fixture-owner',
    status = 200,
  ) {
    const response = await fetch(base + endpoint, {
      method,
      headers: { 'Content-Type': 'application/json', authorization: identity },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const result = await response.json();
    assert.equal(
      response.status,
      status,
      `${method} ${endpoint}: ${JSON.stringify(result.messages)}`,
    );
    count++;
    return result.data;
  }
  const seed = {
    companyNumber: '9000000000001',
    companyName: 'Integration fixture',
    companyHomepageUrl: '',
    remarks: 'before',
    postDetails: [{ no1Content: 'fixture detail', no1Division: '1' }],
  };
  const created = await call('POST', '/shared-posts/', { posts: [seed] });
  const id = created.posts[0].id;
  const postPath = '/shared-posts/' + id;
  const bookmarkPath = '/bookmarked-posts/' + id;
  assert.equal(
    (await db.query('SELECT remarks FROM shared_post WHERE id=$1', [id]))
      .rows[0].remarks,
    'before',
  );
  await call('POST', bookmarkPath);
  assert.equal(
    (
      await db.query(
        'SELECT count(*)::int n FROM bookmark WHERE shared_post_id=$1',
        [id],
      )
    ).rows[0].n,
    1,
  );
  assert.equal(
    (await call('GET', '/bookmarked-posts/?limit=20')).posts.length,
    1,
  );
  await call('POST', bookmarkPath, undefined, 'fixture-owner', 400);
  await call(
    'POST',
    '/bookmarked-posts/missing',
    undefined,
    'fixture-owner',
    400,
  );
  await call('DELETE', bookmarkPath);
  assert.equal(
    (
      await db.query(
        'SELECT count(*)::int n FROM bookmark WHERE shared_post_id=$1',
        [id],
      )
    ).rows[0].n,
    0,
  );
  await call('DELETE', bookmarkPath, undefined, 'fixture-owner', 400);
  await call('POST', bookmarkPath, undefined, 'invalid', 401);
  const updated = await call('PUT', postPath, {
    posts: [
      {
        ...seed,
        id,
        remarks: 'updated',
        postDetails: [{ no1Content: 'updated detail', no1Division: '2' }],
      },
    ],
  });
  assert.equal(
    (await db.query('SELECT remarks FROM shared_post WHERE id=$1', [id]))
      .rows[0].remarks,
    'updated',
  );
  assert.equal(
    (
      await db.query(
        'SELECT no1_content FROM shared_post_detail WHERE shared_post_id=$1',
        [id],
      )
    ).rows[0].no1_content,
    'updated detail',
  );
  assert.equal(
    new Date(updated.posts[0].updatedAt).getTime(),
    new Date(
      (
        await db.query('SELECT updated_at FROM shared_post WHERE id=$1', [id])
      ).rows[0].updated_at,
    ).getTime(),
  );
  assert.equal(
    (await call('GET', '/shared-posts/?limit=20&isMyPostOnly=true')).posts[0]
      .postDetails.length,
    1,
  );
  await call(
    'POST',
    '/shared-posts/',
    { posts: [{ ...seed, companyNumber: 'short' }] },
    'fixture-owner',
    400,
  );
  await call(
    'POST',
    '/shared-posts/',
    {
      posts: [
        {
          ...seed,
          companyNumber: '9000000000002',
          postDetails: [{ no1Content: 'test', no1Division: '999' }],
        },
      ],
    },
    'fixture-owner',
    400,
  );
  await call(
    'POST',
    '/reported-shared-posts/',
    { posts: [{ id, reportDetail: '' }] },
    'fixture-other',
    400,
  );
  await call(
    'PUT',
    postPath,
    { posts: [{ ...seed, id }] },
    'fixture-other',
    400,
  );
  await call('DELETE', postPath, undefined, 'fixture-other', 400);
  await call('POST', '/shared-posts/', { posts: [seed] }, 'fixture-owner', 400);
  await call(
    'POST',
    '/reported-shared-posts/',
    { posts: [{ id, reportDetail: 'local test' }] },
    'fixture-other',
  );
  assert.equal(
    (await db.query('SELECT is_reported FROM shared_post WHERE id=$1', [id]))
      .rows[0].is_reported,
    true,
  );
  assert.equal((await call('GET', '/shared-posts/?limit=20')).posts.length, 0);
  await call('DELETE', postPath);
  assert.equal(
    (await db.query('SELECT is_deleted FROM shared_post WHERE id=$1', [id]))
      .rows[0].is_deleted,
    true,
  );
  // Force a failure after SQL starts, then verify rollback through a separate connection.
  const handler = appContainer.get(types.SequelizeHandler);
  await assert.rejects(
    handler.transact(async (transaction) => {
      await handler.sequelize.query(
        "INSERT INTO user_master(id) VALUES ('fixture-rollback')",
        { transaction },
      );
      throw new Error('rollback probe');
    }),
    /rollback probe/,
  );
  assert.equal(
    (
      await db.query(
        "SELECT count(*)::int n FROM user_master WHERE id='fixture-rollback'",
      )
    ).rows[0].n,
    0,
  );
  process.stdout.write(
    `PASS: ${count} real API calls, persisted writes, ownership checks, validation and rollback\n`,
  );
})()
  .catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await db.end();
    await appContainer.get(types.SequelizeHandler).sequelize.close();
  });
