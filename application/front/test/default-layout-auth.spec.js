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
  props: ['title', 'to'],
  template: '<a :href="to">{{ title }}</a>',
};
stubs['v-img'] = { props: ['src'], template: '<img :src="src" />' };
stubs['v-app-bar-nav-icon'] = { template: '<button />' };

function mountLayout(userId, iconImageUrl, currentPath = '/home') {
  const state = reactive({ userId, iconImageUrl });
  const replace = vi.fn().mockResolvedValue(undefined);
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
        $router: { replace, push: vi.fn() },
        $cloner: { deepClone: (value) => JSON.parse(JSON.stringify(value)) },
      },
    },
  });
  return { wrapper, state, replace };
}

// サイドバーに表示されるメニューの名前
const menu = (wrapper) => wrapper.findAll('a').map((link) => link.text());
const signedOutMenu = ['ホーム', 'ログイン', '使い方'];
const signedInMenu = [
  'ホーム',
  'お気に入り',
  'マイ投稿',
  'ログアウト',
  '使い方',
];

beforeEach(() => {
  refreshNuxtData.mockClear();
});

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
  await nextTick();
  expect(menu(wrapper)).toEqual(signedOutMenu);
  state.userId = 'browser-user';
  state.iconImageUrl = '/avatar.png';
  await nextTick();
  expect(menu(wrapper)).toEqual(signedInMenu);
  expect(refreshNuxtData).toHaveBeenCalledTimes(1);
  state.userId = null;
  await nextTick();
  expect(menu(wrapper)).toEqual(signedOutMenu);
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
