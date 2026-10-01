import { reactive, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { refreshNuxtData } from '#app';
import DefaultLayout from '../layouts/default.vue';

const passthrough = { template: '<div><slot /></div>' };
const stubs = Object.fromEntries(
  [
    'v-app',
    'v-app-bar',
    'v-toolbar-title',
    'v-spacer',
    'v-avatar',
    'v-btn',
    'v-icon',
    'v-navigation-drawer',
    'v-list',
    'v-main',
    'v-container',
    'v-bottom-navigation',
    'SnackBarError',
    'SnackBarInfo',
    'SpinnerOverlay',
  ].map((name) => [name, passthrough]),
);
stubs['v-list-item'] = {
  props: ['title'],
  template: '<div>{{ title }}<slot /></div>',
};
stubs['v-img'] = { props: ['src'], template: '<img :src="src" />' };
stubs['v-app-bar-nav-icon'] = { template: '<button />' };

function mountLayout(userId, iconImageUrl, currentPath = '/home') {
  const state = reactive({ userId, iconImageUrl });
  const replace = jest.fn().mockResolvedValue(undefined);
  const wrapper = mount(DefaultLayout, {
    global: {
      stubs,
      mocks: {
        $accessor: {
          firebaseAuthorization: {
            get userIdComputed() {
              return state.userId;
            },
            get userInfoComputed() {
              return state;
            },
          },
        },
        $vuetify: { display: { smAndDown: false } },
        $route: { path: currentPath },
        $router: { replace, push: jest.fn() },
        $cloner: { deepClone: (value) => JSON.parse(JSON.stringify(value)) },
      },
    },
  });
  return { wrapper, state, replace };
}

beforeEach(() => refreshNuxtData.mockClear());

test('SSRからの画像とログイン後の画像更新を表示する', async () => {
  const { wrapper, state } = mountLayout('server-user', '/initial.png');
  expect(wrapper.find('img').attributes('src')).toBe('/initial.png');
  state.iconImageUrl = '/updated.png';
  await nextTick();
  expect(wrapper.find('img').attributes('src')).toBe('/updated.png');
  wrapper.unmount();
});

test('認証状態の変化に応じてメニューと投稿を更新する', async () => {
  const { wrapper, state } = mountLayout(null, null);
  expect(wrapper.vm.sideBarItems.map((item) => item.title)).toContain(
    'ログイン',
  );
  state.userId = 'browser-user';
  state.iconImageUrl = '/avatar.png';
  await nextTick();
  expect(wrapper.vm.sideBarItems.map((item) => item.title)).toContain(
    'ログアウト',
  );
  expect(refreshNuxtData).toHaveBeenCalledTimes(1);
  state.userId = null;
  await nextTick();
  expect(wrapper.vm.sideBarItems.map((item) => item.title)).toContain(
    'ログイン',
  );
  expect(refreshNuxtData).toHaveBeenCalledTimes(2);
  wrapper.unmount();
});

test.each(['/bookmark', '/my-post'])(
  '%s でログアウトしたらホームへ戻す',
  async (currentPath) => {
    const { wrapper, state, replace } = mountLayout(
      'server-user',
      null,
      currentPath,
    );
    state.userId = null;
    await nextTick();
    expect(replace).toHaveBeenCalledWith('/home');
    wrapper.unmount();
  },
);
