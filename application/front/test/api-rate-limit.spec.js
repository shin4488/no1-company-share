/** @jest-environment node */
import express, { Router } from 'express';
import { apiRateLimiter } from '../../server/common/middleware/apiRateLimit';

test('認証済みユーザーの枠は互換URLでも共有し、他のユーザーを巻き込まない', async () => {
  const app = express();
  const router = Router();
  // 認証サービスには接続せず、検証済みUIDを設定する境界を差し替える。
  router.use((req, res, next) => {
    res.locals.firebaseUserId = req.headers['x-test-verified-user'];
    next();
  });
  router.use(apiRateLimiter);
  router.all('/users/', (_req, res) => res.status(204).end());
  app.use('/api/v1/localhost', router);
  app.use('/api/v1', router);
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (user, alias = false, forwarded = '192.0.2.1') =>
    fetch(`${base}/api/v1${alias ? '/localhost' : ''}/users/`, {
      method: 'POST',
      headers: {
        'x-test-verified-user': user,
        'x-forwarded-for': forwarded,
      },
    });
  try {
    for (let i = 0; i < 120; i++) {
      expect((await request('user-a', i % 2 === 0)).status).toBe(204);
    }
    const blocked = await request('user-a', true, '192.0.2.2');
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get('retry-after'))).toBeGreaterThan(0);
    expect((await blocked.json()).messages[0].message).toContain('再試行');
    expect((await request('user-b')).status).toBe(204);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    apiRateLimiter.resetKey('user:user-a');
    apiRateLimiter.resetKey('user:user-b');
  }
});
