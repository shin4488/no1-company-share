import plugin from '../plugins/axios/axios';

function setup(token = 'test-id-token') {
  const hooks = {};
  const open = jest.fn();
  plugin({
    $axios: {
      onRequest: (hook) => {
        hooks.request = hook;
      },
      onResponse: (hook) => {
        hooks.response = hook;
      },
      onResponseError: (hook) => {
        hooks.error = hook;
      },
    },
    $accessor: {
      firebaseAuthorization: { idTokenComputed: token },
      snackBarError: { open },
    },
  });
  return { hooks, open };
}

describe('API通信の表示・認証契約', () => {
  test.each(['test-id-token', null])(
    'IDトークン %s を既存ヘッダーにそのまま設定する',
    (token) => {
      const { hooks } = setup(token);
      const config = { headers: { Accept: 'application/json' } };
      expect(hooks.request(config)).toBe(config);
      expect(config.headers).toEqual({
        Accept: 'application/json',
        Authorization: token,
      });
    },
  );
  test.each(['response', 'error'])(
    '%s に含まれる複数メッセージを改行して表示する',
    (kind) => {
      const { hooks, open } = setup();
      const response = {
        data: {
          messages: [
            { message: '入力を確認してください' },
            { message: '会社名が必要です' },
          ],
        },
      };
      hooks[kind](kind === 'response' ? response : { response });
      expect(open).toHaveBeenCalledWith(
        '入力を確認してください\n会社名が必要です',
      );
    },
  );
  test('空のメッセージとレスポンスのない通信失敗では通知を追加しない', () => {
    const { hooks, open } = setup();
    hooks.response({ data: { messages: [] } });
    hooks.error({});
    expect(open).not.toHaveBeenCalled();
  });
});
