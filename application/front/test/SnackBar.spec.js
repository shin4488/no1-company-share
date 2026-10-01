import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import SnackBarBase from '../components/SnackBarBase.vue';
import SnackBarInfo from '../components/SnackBarInfo.vue';
import SnackBarError from '../components/SnackBarError.vue';

const stubs = {
  'v-snackbar': {
    props: ['modelValue', 'color'],
    template:
      '<section v-if="modelValue" :data-color="color"><slot /><slot name="actions" /></section>',
  },
  'v-btn': {
    template: '<button><slot /></button>',
  },
  'v-icon': true,
};

describe.each([
  [SnackBarInfo, 'snackBarInfo', 'primary'],
  [SnackBarError, 'snackBarError', 'error'],
])('%s の通知', (component, moduleName, color) => {
  function mountNotification() {
    const store = createStore({
      modules: {
        [moduleName]: {
          namespaced: true,
          state: () => ({ message: '' }),
          mutations: {
            open(state, message) {
              state.message = message;
            },
          },
        },
      },
    });
    const wrapper = mount(component, {
      global: { plugins: [store], components: { SnackBarBase }, stubs },
    });
    return { store, wrapper };
  }

  test('通知を開き、指定の色で原文と改行を表示する', async () => {
    const { store, wrapper } = mountNotification();
    const message =
      '日本語の通知\n\nhttps://example.invalid/長いURL\n<b>原文</b>';
    expect(wrapper.find('section').exists()).toBe(false);
    store.commit(`${moduleName}/open`, message);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('section').attributes('data-color')).toBe(color);
    expect(wrapper.find('section > div').element.textContent).toBe(message);
    expect(wrapper.find('b').exists()).toBe(false);
    wrapper.unmount();
  });

  test('空の通知では開かない', async () => {
    const { store, wrapper } = mountNotification();
    store.commit(`${moduleName}/open`, '');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('section').exists()).toBe(false);
    wrapper.unmount();
  });

  test('閉じたあとに別の通知を開ける', async () => {
    const { store, wrapper } = mountNotification();
    store.commit(`${moduleName}/open`, '最初の通知');
    await wrapper.vm.$nextTick();
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('section').exists()).toBe(false);
    expect(store.state[moduleName].message).toBe('最初の通知');
    store.commit(`${moduleName}/open`, '次の通知');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('section > div').element.textContent).toBe('次の通知');
    wrapper.unmount();
  });
});

test('通知の自動終了を親の表示状態へ伝える', async () => {
  const wrapper = mount(SnackBarBase, {
    props: { modelValue: true, message: '通知' },
    global: { stubs },
  });
  wrapper
    .findComponent(stubs['v-snackbar'])
    .vm.$emit('update:modelValue', false);
  await wrapper.vm.$nextTick();
  expect(wrapper.emitted('update:modelValue')).toEqual([[false]]);
  wrapper.unmount();
});
