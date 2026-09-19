const mockLog = jest.fn();
jest.mock('@s/common/dependencyInjection/inversify.config', () => ({
  appContainer: { get: () => ({ log: mockLog }) },
}));
const { logRequestResponse } = require('@s/common/middleware/logger');
test('障害調査ログに認証情報や入力内容を残さない', () => {
  const next = jest.fn();
  logRequestResponse(
    {
      method: 'POST',
      path: '/bookmarked-posts/fixture',
      url: '/bookmarked-posts/fixture?token=private-query',
      headers: { authorization: 'private-token', cookie: 'private-cookie' },
      query: { token: 'private-query' },
      body: { reportDetail: 'private-report' },
    },
    {},
    next,
  );
  expect(mockLog.mock.calls).toEqual([
    ['info', { method: 'POST', path: '/bookmarked-posts/fixture' }],
  ]);
  expect(next).toHaveBeenCalledTimes(1);
});
