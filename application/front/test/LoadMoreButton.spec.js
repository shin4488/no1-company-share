import { mount } from '@vue/test-utils';
import LoadMoreButton from '@/components/LoadMoreButton.vue';

const stubs = {
  'v-btn': { template: '<button @click="$emit(\'click\')"><slot /></button>' },
};

describe('追加読み込みボタン', () => {
  test('既定の文言を表示し、クリックを親へ通知する', async () => {
    const wrapper = mount(LoadMoreButton, { stubs });
    expect(wrapper.text()).toBe('さらに表示');
    expect(wrapper.emitted('click')).toBeUndefined();
    await wrapper.find('button').trigger('click');
    expect(wrapper.emitted('click')).toEqual([[]]);
    wrapper.destroy();
  });

  test('指定された表示文言を使用する', () => {
    const wrapper = mount(LoadMoreButton, {
      stubs,
      propsData: { text: '次の20件' },
    });
    expect(wrapper.text()).toBe('次の20件');
    wrapper.destroy();
  });
});
