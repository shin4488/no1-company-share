import plugin from '../plugins/axios/axios';
function setup(token = 'test-id-token') {
  let api;
  const open = jest.fn();
  plugin(
    {
      $accessor: {
        firebaseAuthorization: { idTokenComputed: token },
        snackBarError: { open },
      },
    },
    (name, value) => {
      if (name === 'axios') {
        api = value;
      }
    },
  );
  return { api, open };
}
describe('API通信の表示・認証契約', () => {
  test.each(['test-id-token', null])(
    '認証トークン %s と既存ヘッダーを維持する',
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
      expect(config.headers.get('Authorization')).toBe(token);
      expect(config.headers.get('Accept')).toBe('application/json');
    },
  );
  test.each([200, 400])(
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
  test('通信失敗では余計な通知を追加せず呼び出し元へ失敗を伝える', async () => {
    const { api, open } = setup();
    api.defaults.adapter = () => Promise.reject(new Error('offline'));
    await expect(api.get('/posts')).rejects.toThrow('offline');
    expect(open).not.toHaveBeenCalled();
  });
});
