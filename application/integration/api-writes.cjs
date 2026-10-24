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
// The company search returns these two companies instead of calling gBizINFO.
const companies = ['9000000000001', '9000000000002'];
appContainer.rebind(types.ExternalCompanyLogic).toConstantValue({
  getExternalCompany: () =>
    Promise.resolve({
      companies: companies.map((companyNumber) => ({
        companyNumber,
        japaneseName: 'Integration fixture',
        englishName: 'Integration fixture',
      })),
    }),
});
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
initializeApp({ projectId: 'demo-local-write-test' });
// Only identity verification and gBizINFO are replaced; routes, DI, validation, services and SQL are real.
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
  async function send(method, endpoint, body, identity = 'fixture-owner') {
    const response = await fetch(base + endpoint, {
      method,
      headers: { 'Content-Type': 'application/json', authorization: identity },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const result = await response.json();
    count++;
    return {
      status: response.status,
      messages: result.messages.map((x) => x.message),
      data: result.data,
    };
  }
  async function call(
    method,
    endpoint,
    body,
    identity = 'fixture-owner',
    status = 200,
  ) {
    const result = await send(method, endpoint, body, identity);
    assert.equal(
      result.status,
      status,
      `${method} ${endpoint}: ${JSON.stringify(result.messages)}`,
    );
    return result.data;
  }
  const postOf = async (id) =>
    (await db.query('SELECT * FROM shared_post WHERE id=$1', [id])).rows[0];
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
      (await db.query('SELECT updated_at FROM shared_post WHERE id=$1', [id]))
        .rows[0].updated_at,
    ).getTime(),
  );
  assert.equal(
    (await call('GET', '/shared-posts/?limit=20&isMyPostOnly=true')).posts[0]
      .postDetails.length,
    1,
  );
  // The dialog keeps the company of a post fixed, so the API rejects a change to another registered company.
  await db.query(
    "INSERT INTO company_master(company_number,company_japanese_name) VALUES ('9000000000004','Integration fixture 4') ON CONFLICT DO NOTHING",
  );
  assert.deepEqual(
    await send('PUT', postPath, {
      posts: [{ ...seed, id, companyNumber: '9000000000004' }],
    }),
    { status: 400, messages: ['投稿の会社は変更できません。'], data: null },
  );
  assert.equal((await postOf(id)).company_number, seed.companyNumber);
  // One request cannot contain two posts about the same company.
  const racing = { ...seed, companyNumber: '9000000000003' };
  assert.deepEqual(
    await send('POST', '/shared-posts/', { posts: [racing, racing] }),
    {
      status: 400,
      messages: ['同じ企業に関する投稿が複数含まれています。'],
      data: null,
    },
  );
  const racingPosts = () =>
    db.query(
      "SELECT id FROM shared_post WHERE user_id='fixture-owner' AND company_number=$1 AND NOT is_deleted AND NOT is_reported",
      [racing.companyNumber],
    );
  assert.equal((await racingPosts()).rows.length, 0);
  // Simultaneous posts by the same user about the same company save only one post.
  const racingResults = await Promise.all(
    Array.from({ length: 8 }, () =>
      send('POST', '/shared-posts/', { posts: [racing] }),
    ),
  );
  assert.deepEqual(
    racingResults.map((x) => x.status).sort(),
    [200, 400, 400, 400, 400, 400, 400, 400],
  );
  assert.ok(
    racingResults
      .filter((x) => x.status === 400)
      .every(
        (x) =>
          x.messages[0] === '同じ企業に関する自分の投稿がすでに存在します。',
      ),
  );
  const racingRows = (await racingPosts()).rows;
  assert.equal(racingRows.length, 1);
  await call('DELETE', '/shared-posts/' + racingRows[0].id);
  await call(
    'POST',
    '/shared-posts/',
    { posts: [{ ...seed, companyNumber: 'short' }] },
    'fixture-owner',
    400,
  );
  await call('GET', '/companies/', undefined, 'fixture-owner', 400);
  await call(
    'GET',
    '/companies/?companyName=a&companyName=b',
    undefined,
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
  // The company search marks only companies that the signed-in user has an active post for.
  async function postedCompanies(identity) {
    const data = await call(
      'GET',
      '/companies/?companyName=',
      undefined,
      identity,
    );
    return data.companies
      .filter((company) => company.isPostedByLoginUser)
      .map((company) => company.number);
  }
  assert.deepEqual(await postedCompanies('fixture-owner'), [
    seed.companyNumber,
  ]);
  assert.deepEqual(await postedCompanies('fixture-other'), []);
  assert.deepEqual(await postedCompanies('invalid'), []);
  const otherCreated = await call(
    'POST',
    '/shared-posts/',
    { posts: [seed] },
    'fixture-other',
  );
  const otherPostPath = '/shared-posts/' + otherCreated.posts[0].id;
  assert.deepEqual(await postedCompanies('fixture-other'), [
    seed.companyNumber,
  ]);
  await call('POST', '/shared-posts/', { posts: [seed] }, 'fixture-other', 400);
  assert.deepEqual(
    (await call('GET', '/shared-posts/?limit=20', undefined, 'invalid')).posts
      .filter((post) => post.companyNumber === seed.companyNumber)
      .map((post) => post.postingUserId)
      .sort(),
    ['fixture-other', 'fixture-owner'],
  );
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
  assert.ok(
    !(await call('GET', '/shared-posts/?limit=20')).posts.some(
      (post) => post.id === id,
    ),
  );
  assert.deepEqual(await postedCompanies('fixture-owner'), []);
  // Updating a reported or deleted post does not bring it back.
  const notFound = {
    status: 400,
    messages: ['存在する投稿の投稿No.を入力してください。'],
    data: null,
  };
  assert.deepEqual(
    await send('PUT', postPath, { posts: [{ ...seed, id }] }),
    notFound,
  );
  assert.equal((await postOf(id)).is_reported, true);
  await call('DELETE', postPath);
  assert.deepEqual(
    await send('PUT', postPath, { posts: [{ ...seed, id }] }),
    notFound,
  );
  assert.equal((await postOf(id)).is_deleted, true);
  await call('DELETE', otherPostPath, undefined, 'fixture-other');
  assert.deepEqual(await postedCompanies('fixture-other'), []);
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
    `PASS: ${count} real API calls, persisted writes, ownership checks, same-company posts, simultaneous posts, validation and rollback\n`,
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
