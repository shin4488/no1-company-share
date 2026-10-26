// @vitest-environment node
import express, { json } from 'express';
import { logRequestResponse } from '@s/common/middleware/logger';

const mockLog = vi.hoisted(() => vi.fn());
vi.mock('@s/common/dependencyInjection/inversify.config', () => ({
  appContainer: { get: () => ({ log: mockLog }) },
}));

test('障害調査ログに要求の種類と場所だけを残し、認証情報や入力内容を残さない', async () => {
  const app = express();
  app.use(json());
  app.use(logRequestResponse);
  app.post('/bookmarked-posts/:postId', (_request, response) => {
    response.send('handled');
  });
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  try {
    const response = await fetch(
      `http://127.0.0.1:${server.address().port}/bookmarked-posts/fixture?token=private-query`,
      {
        method: 'POST',
        headers: {
          authorization: 'private-token',
          cookie: 'private-cookie',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ reportDetail: 'private-report' }),
      },
    );
    expect(await response.text()).toBe('handled');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }

  const logged = JSON.stringify(mockLog.mock.calls);
  expect(logged).toContain('POST');
  expect(logged).toContain('/bookmarked-posts/fixture');
  expect(logged).not.toContain('private');
});
