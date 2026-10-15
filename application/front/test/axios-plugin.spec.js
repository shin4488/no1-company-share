import plugin from '../plugins/02.axios';

function setup(token = 'test-id-token') {
  const open = vi.fn();
  const authorization = { idTokenComputed: token };
  const result = plugin({
    $accessor: {
      firebaseAuthorization: authorization,
      snackBarError: { open },
    },
  });
  return { api: result.provide.axios, open, authorization };
}

describe('API通信の表示と認証', () => {
  test.each(['test-id-token', null])(
    'トークン %s と既存ヘッダーを維持する',
    async (token) => {
      const { api } = setup(token);
      let config;
      api.defaults.adapter = (request) => {
        config = request;
        return Promise.resolve({
          data: { messages: [] },
          status: 200,
          config: request,
          headers: {},
        });
      };
      await api.get('/posts', { headers: { Accept: 'application/json' } });
      expect(config.headers.get('Authorization')).toBe(
        token ? `Bearer ${token}` : undefined,
      );
      expect(config.headers.get('Accept')).toBe('application/json');
    },
  );
  test.each([200, 400, 429])(
    'HTTP %s の複数メッセージを改行表示する',
    async (status) => {
      const { api, open } = setup();
      const response = {
        status,
        data: {
          messages: [
            { message: '入力を確認してください' },
            { message: '会社名が必要です' },
          ],
        },
        headers: {},
      };
      const failure = Object.assign(new Error('HTTP failure'), { response });
      api.defaults.adapter = () =>
        status === 200 ? Promise.resolve(response) : Promise.reject(failure);
      if (status === 200) {
        await api.get('/posts');
      } else {
        await expect(api.get('/posts')).rejects.toBe(failure);
      }
      expect(open).toHaveBeenCalledWith(
        '入力を確認してください\n会社名が必要です',
      );
    },
  );
  test('通信失敗を表示し呼び出し元へ失敗を伝える', async () => {
    const { api, open } = setup();
    api.defaults.adapter = () => Promise.reject(new Error('offline'));
    await expect(api.get('/posts')).rejects.toThrow('offline');
    expect(open).toHaveBeenCalledWith(
      '通信に失敗しました。接続を確認して再試行してください。',
    );
  });
});

test('配列のクエリは同じ名前を繰り返して送る', () => {
  const { api } = setup();
  const pageUris = ['https://example.com/a', 'https://example.com/b'];
  const uri = new URL(
    api.getUri({ url: '/open-graph/', params: { pageUris } }),
    'http://localhost',
  );
  expect([...uri.searchParams.keys()]).toEqual(['pageUris', 'pageUris']);
  expect(uri.searchParams.getAll('pageUris')).toEqual(pageUris);
});
