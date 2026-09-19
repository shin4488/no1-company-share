/** @jest-environment node */
import 'reflect-metadata';
import express, { Router, json } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { apiRateLimiter } from '../../server/common/middleware/apiRateLimit';
import { appContainer } from '../../server/common/dependencyInjection/inversify.config';
import { types } from '../../server/common/dependencyInjection/types';
import { ApiResponseHandlerImpl } from '../../server/common/apiResponse/apiResponseHandler';
import { catchError } from '../../server/common/middleware/appErrorHandler';
import { userRouter } from '../../server/feature/user/controller';
import { bookmarkRouter } from '../../server/feature/bookmark/controller';
import { sharedPostRouter } from '../../server/feature/sharedPost/controller';
import { userDevelopmentRouter } from '../../server/feature/development/user/controller';

jest.mock('firebase-admin/auth', () => ({ getAuth: jest.fn() }));
jest.mock('../../server/common/dependencyInjection/inversify.config', () => ({
  appContainer: { get: jest.fn() },
}));

// HTTP、認証ミドルウェア、実ルート、入力検証、エラー変換は本物を使う。
// Firebaseの検証とDBに接続するサービスだけを境界で差し替える。
const service = {
  save: jest.fn(),
  getBookmarks: jest.fn(),
  postNewBookmarks: jest.fn(),
  deleteBookmarks: jest.fn(),
  getAliveSharedPosts: jest.fn(),
  insertSharedPosts: jest.fn(),
  updateSharedPosts: jest.fn(),
  deleteSharedPostsLogically: jest.fn(),
  reportSharedPosts: jest.fn(),
};
const validUser = {
  iconImageUrl: 'https://example.com/icon.png',
  displayedName: '利用者',
};
const routes = [
  ['POST', '/users/', validUser, 'save'],
  ['GET', '/bookmarked-posts/post-1', undefined, 'getBookmarks'],
  ['POST', '/bookmarked-posts/post-1', {}, 'postNewBookmarks'],
  ['DELETE', '/bookmarked-posts/post-1', {}, 'deleteBookmarks'],
  ['GET', '/shared-posts/post-1', undefined, 'getAliveSharedPosts'],
  ['POST', '/shared-posts/', { posts: [] }, 'insertSharedPosts'],
  ['PUT', '/shared-posts/post-1', { posts: [] }, 'updateSharedPosts'],
  [
    'DELETE',
    '/shared-posts/post-1',
    { posts: [] },
    'deleteSharedPostsLogically',
  ],
  ['POST', '/reported-shared-posts/', { posts: [] }, 'reportSharedPosts'],
  ['POST', '/development/users', {}, null],
];
let server;
let base;
let user;
let sequence = 0;
const keys = new Set();

beforeAll(async () => {
  const app = express();
  const router = Router();
  app.use(json());
  router.use(
    userRouter,
    bookmarkRouter,
    sharedPostRouter,
    userDevelopmentRouter,
  );
  app.use('/api/v1/localhost', router);
  app.use('/api/v1', router);
  app.use(catchError);
  server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});
beforeEach(() => {
  jest.clearAllMocks();
  user = `rate-test-${++sequence}`;
  getAuth.mockReturnValue({
    verifyIdToken: (token) => {
      if (!token.startsWith('valid:')) {
        return Promise.reject(new Error('invalid token'));
      }
      return Promise.resolve({ uid: token.slice(6) });
    },
  });
  appContainer.get.mockImplementation((type) => {
    if (type === types.ApiResponseHandler) {
      return new ApiResponseHandlerImpl();
    }
    if (type === types.LogHandler) {
      return { error: jest.fn() };
    }
    if (
      [
        types.UserService,
        types.BookmarkService,
        types.SharedPostService,
      ].includes(type)
    ) {
      return service;
    }
    throw new Error('Unexpected DB access');
  });
});
afterEach(() => {
  for (const key of keys) {
    apiRateLimiter.resetKey(key);
  }
  keys.clear();
});
afterAll(async () => {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
});

async function request(
  method,
  path,
  body,
  { uid = user, alias = false, headers = {} } = {},
) {
  keys.add(`user:${uid}`);
  keys.add('ip:127.0.0.1');
  return await fetch(`${base}/api/v1${alias ? '/localhost' : ''}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(uid ? { authorization: `valid:${uid}` } : {}),
      ...headers,
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
async function exhaust(options = {}) {
  // 並行リクエストでも120件だけ許可されることを後続の429と合わせて確認。
  const responses = await Promise.all(
    Array.from({ length: 120 }, (_, i) =>
      request('GET', '/shared-posts/', undefined, {
        alias: i % 2 === 0,
        ...options,
      }),
    ),
  );
  expect(responses.every((response) => response.status === 200)).toBe(true);
}

test.each(routes.slice(0, 9))(
  '%s %s の正常処理とサービス呼び出しを維持する',
  async (method, path, body, operation) => {
    const response = await request(method, path, body);
    expect(response.status).toBe(200);
    expect(service[operation]).toHaveBeenCalledTimes(1);
    expect(response.headers.get('ratelimit')).toContain('r=119');
  },
);

test.each(routes)(
  '%s %s は両URLで上限後にDB処理を呼ばない',
  async (method, path, body) => {
    await exhaust();
    appContainer.get.mockClear();
    for (const alias of [false, true]) {
      const response = await request(method, path, body, {
        alias,
        headers: { 'x-forwarded-for': '192.0.2.2' },
      });
      expect(response.status).toBe(429);
      expect(Number(response.headers.get('retry-after'))).toBeGreaterThan(0);
      expect((await response.json()).messages[0].message).toContain('再試行');
    }
    expect(appContainer.get).not.toHaveBeenCalled();
    expect(
      (await request('POST', '/users/', validUser, { uid: `${user}-other` }))
        .status,
    ).toBe(200);
  },
);

test('未認証・偽造トークンは401で、偽のUIDヘッダーから認証枠を消費できない', async () => {
  for (const authorization of ['', 'null', 'undefined', 'forged']) {
    const response = await request('POST', '/users/', validUser, {
      headers: { authorization, 'x-test-verified-user': user },
    });
    expect(response.status).toBe(401);
  }
  expect(service.save).not.toHaveBeenCalled();
  const valid = await request('POST', '/users/', validUser);
  expect(valid.status).toBe(200);
  expect(valid.headers.get('ratelimit')).toContain('r=119');
});

test('匿名の公開GETはIP枠を使い、転送ヘッダーや無効トークンで回避できない', async () => {
  await exhaust({ uid: null });
  const response = await request('GET', '/shared-posts/', undefined, {
    uid: null,
    alias: true,
    headers: {
      authorization: 'forged',
      'x-forwarded-for': '203.0.113.2',
      forwarded: 'for=203.0.113.3',
    },
  });
  expect(response.status).toBe(429);
  expect((await request('GET', '/shared-posts/')).status).toBe(200);
});

test('入力不正とサービス失敗は従来の400/500で返り、枠にも数える', async () => {
  const invalid = await request('POST', '/users/', { displayedName: '利用者' });
  expect(invalid.status).toBe(400);
  expect(service.save).not.toHaveBeenCalled();
  service.save.mockRejectedValueOnce(new Error('private database error'));
  const failed = await request('POST', '/users/', validUser);
  expect(failed.status).toBe(500);
  expect(JSON.stringify(await failed.json())).not.toContain(
    'private database error',
  );
  const valid = await request('POST', '/users/', validUser);
  expect(valid.status).toBe(200);
  expect(valid.headers.get('ratelimit')).toContain('r=117');
});

test('同時に150件到着しても120件だけを許可する', async () => {
  const responses = await Promise.all(
    Array.from({ length: 150 }, () => request('POST', '/users/', validUser)),
  );
  expect(responses.filter((response) => response.status === 200)).toHaveLength(
    120,
  );
  expect(responses.filter((response) => response.status === 429)).toHaveLength(
    30,
  );
  expect(service.save).toHaveBeenCalledTimes(120);
});

test('60秒の窓が過ぎると同じ利用者が再試行できる', async () => {
  // HTTPイベントと実タイマーは維持し、MemoryStoreが参照する時計だけ進める。
  jest.useFakeTimers({
    doNotFake: [
      'nextTick',
      'setImmediate',
      'clearImmediate',
      'setTimeout',
      'clearTimeout',
      'setInterval',
      'clearInterval',
      'performance',
      'hrtime',
      'queueMicrotask',
    ],
  });
  try {
    await exhaust();
    expect((await request('POST', '/users/', validUser)).status).toBe(429);
    jest.setSystemTime(Date.now() + 60001);
    const retried = await request('POST', '/users/', validUser);
    expect(retried.status).toBe(200);
    expect(retried.headers.get('ratelimit')).toContain('r=119');
  } finally {
    jest.useRealTimers();
  }
});
