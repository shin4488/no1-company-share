import Vue from 'vue/dist/vue.runtime.common.prod';
import { createRenderer } from 'vue-server-renderer';
import plugin from '../plugins/firebase/client';

const listeners = [];
const auth = { currentUser: null };
jest.mock('firebase/app', () => ({
  getApps: () => ['app'],
  initializeApp: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  getAuth: () => auth,
  onAuthStateChanged: (_auth, listener, onError) => {
    listeners.push({ listener, onError });
  },
}));
jest.mock('firebase/analytics', () => ({ getAnalytics: jest.fn() }));
jest.mock('@c/firebaseConfig', () => ({
  firebaseConfig: { projectId: 'demo-test' },
}));

const user = (uid) => ({
  uid,
  getIdTokenResult: jest.fn().mockResolvedValue({ claims: {} }),
});
let ready;
beforeEach(() => {
  listeners.length = 0;
  ready = undefined;
  window.onNuxtReady = (callback) => {
    ready = callback;
  };
});
afterEach(() => {
  document.body.innerHTML = '';
  delete window.onNuxtReady;
});

// DefaultLayoutのログイン時だけ表示するアバターと同じDOM構造。
// production版Vueを使い、開発版のhydrationフォールバックで不具合を隠さない。
const page = (state) =>
  new Vue({
    data: () => state,
    render(h) {
      return h('div', [this.userId ? h('span', [h('img')]) : this._e()]);
    },
  });

test.each([
  [null, user('signed-in')],
  ['server-user', null],
  ['same-user', user('same-user')],
  [null, null],
])(
  'SSRの状態 %s を保って描画し、その後ブラウザの認証状態に同期する',
  async (serverUserId, browserUser) => {
    const state = { userId: serverUserId };
    const html = await createRenderer().renderToString(page({ ...state }));
    document.body.innerHTML = html;
    const originalRoot = document.body.firstChild;
    const dispatch = jest.fn((_action, { authUser }) => {
      state.userId = authUser?.uid ?? null;
      return Promise.resolve();
    });
    const inject = jest.fn();
    const error = jest.fn();
    const pending = plugin({ store: { dispatch }, error }, inject);
    // 修正前のように初期描画前から購読している場合も、初回通知を実際に届ける。
    if (listeners.length) {
      await listeners[0].listener(browserUser);
    }
    await pending;
    const vm = page(state);
    expect(() => vm.$mount(originalRoot, true)).not.toThrow();
    expect(vm.$el).toBe(originalRoot);
    expect(dispatch).not.toHaveBeenCalled();
    expect(inject).toHaveBeenCalledWith('fire', { auth });
    ready();
    await listeners[0].listener(browserUser);
    await Vue.nextTick();
    expect(state.userId).toBe(browserUser?.uid ?? null);
    expect(Boolean(vm.$el.querySelector('img'))).toBe(Boolean(browserUser));
    expect(error).not.toHaveBeenCalled();
    vm.$destroy();
  },
);

test('描画後もログイン・ログアウトの通知を反映する', async () => {
  const dispatch = jest.fn().mockResolvedValue(undefined);
  await plugin({ store: { dispatch }, error: jest.fn() }, jest.fn());
  ready();
  for (const authUser of [user('first'), null, user('second')]) {
    await listeners[0].listener(authUser);
    expect(dispatch).toHaveBeenLastCalledWith(
      'firebaseAuthorization/onAuthStateChangedAction',
      { authUser, claims: authUser ? {} : null },
    );
  }
});

test.each(['token', 'store', 'listener'])(
  '認証同期の失敗（%s）を未処理のPromiseにせず画面へ通知する',
  async (failure) => {
    const dispatch = jest.fn().mockResolvedValue(undefined);
    const error = jest.fn();
    const authUser = user('test');
    await plugin({ store: { dispatch }, error }, jest.fn());
    ready();
    if (failure === 'token') {
      authUser.getIdTokenResult.mockRejectedValue(new Error('token failure'));
    }
    if (failure === 'store') {
      dispatch.mockRejectedValue(new Error('store failure'));
    }
    if (failure === 'listener') {
      listeners[0].onError(new Error('listener failure'));
    } else {
      await expect(listeners[0].listener(authUser)).resolves.toBeUndefined();
    }
    expect(error).toHaveBeenCalledWith({
      statusCode: 503,
      message:
        '認証状態を確認できませんでした。ページを再読み込みしてください。',
    });
  },
);
