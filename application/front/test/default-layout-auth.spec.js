import Vue from 'vue';
import { shallowMount } from '@vue/test-utils';
import DefaultLayout from '../layouts/default.vue';

const stubs = [
  'v-app',
  'v-app-bar',
  'v-app-bar-nav-icon',
  'v-toolbar-title',
  'v-spacer',
  'v-list-item-avatar',
  'v-navigation-drawer',
  'v-list',
  'v-list-item',
  'v-list-item-action',
  'v-icon',
  'v-list-item-content',
  'v-list-item-title',
  'v-main',
  'v-container',
  'v-bottom-navigation',
  'v-slide-group',
  'v-slide-item',
  'v-btn',
  'SnackBarError',
  'SnackBarInfo',
  'SpinnerOverlay',
  'Nuxt',
].reduce((result, name) => ({ ...result, [name]: true }), {});

function mountLayout(userId, iconImageUrl) {
  const state = Vue.observable({ userId, iconImageUrl });
  const refresh = jest.fn().mockResolvedValue(undefined);
  const wrapper = shallowMount(DefaultLayout, {
    stubs: {
      ...stubs,
      'v-img': { props: ['src'], template: '<img :src="src">' },
    },
    mocks: {
      // 初期描画時点でFirebase SDKのcurrentUserがまだ復元されていなくても動作する。
      $fire: { auth: { currentUser: null } },
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
      $vuetify: { breakpoint: { xs: false, sm: false } },
      $nuxt: { $route: { path: '/home' }, refresh },
      $cloner: { deepClone: (value) => JSON.parse(JSON.stringify(value)) },
    },
  });
  return { wrapper, state, refresh };
}

test('SSRから引き継いだ画像を表示し、同じユーザーの画像更新も反映する', async () => {
  const { wrapper, state } = mountLayout('server-user', '/initial-avatar.png');
  expect(wrapper.find('img').attributes('src')).toBe('/initial-avatar.png');
  state.iconImageUrl = '/updated-avatar.png';
  await Vue.nextTick();
  expect(wrapper.find('img').attributes('src')).toBe('/updated-avatar.png');
  wrapper.destroy();
});

test('描画後のログイン・ログアウトで画像、メニュー、ホームのデータを更新する', async () => {
  const { wrapper, state, refresh } = mountLayout(null, null);
  await Vue.nextTick();
  expect(wrapper.find('img').exists()).toBe(false);
  expect(wrapper.text()).toContain('ログイン');
  state.userId = 'browser-user';
  state.iconImageUrl = '/avatar.png';
  await Vue.nextTick();
  expect(wrapper.find('img').attributes('src')).toBe('/avatar.png');
  expect(wrapper.text()).toContain('ログアウト');
  expect(refresh).toHaveBeenCalledTimes(1);
  state.userId = null;
  state.iconImageUrl = null;
  await Vue.nextTick();
  expect(wrapper.find('img').exists()).toBe(false);
  expect(wrapper.text()).toContain('ログイン');
  expect(refresh).toHaveBeenCalledTimes(2);
  wrapper.destroy();
});
