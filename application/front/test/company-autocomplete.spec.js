import { mount, flushPromises } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import SharedPostDialog from '../components/SharedPostDialog.vue';

// jsdomにないブラウザAPIのうち、Vuetifyのメニュー表示が使うもの
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
globalThis.visualViewport ??= Object.assign(new EventTarget(), {
  width: 1024,
  height: 768,
  offsetLeft: 0,
  offsetTop: 0,
  scale: 1,
});

const companies = [
  {
    number: '1000000000001',
    name: '株式会社ＡＢＣ',
    isPostedByLoginUser: false,
  },
  {
    number: '1000000000002',
    name: 'ＸＹＺ工業株式会社',
    isPostedByLoginUser: true,
  },
];

const options = () =>
  [...document.querySelectorAll('[role="option"]')].map((el) => ({
    title: el.querySelector('.v-list-item-title').textContent.trim(),
    subtitle: el.querySelector('.v-list-item-subtitle')?.textContent.trim(),
    disabled: el.classList.contains('v-list-item--disabled'),
  }));

const get = vi.fn();

async function openCompanyMenu() {
  get.mockReset().mockResolvedValue({
    data: { messages: [], data: { companies } },
  });
  const wrapper = mount(SharedPostDialog, {
    attachTo: document.body,
    props: { no1Divisions: [{ text: '世界一', value: '1' }] },
    global: {
      plugins: [createVuetify({ components, directives })],
      stubs: { ConfirmDialog: true, Spinner: true },
      mocks: { $axios: { get }, $accessor: {} },
    },
  });
  wrapper.vm.open({
    postId: '',
    companyNumber: '',
    companyName: '',
    companyHomepageUrl: '',
    companyImageUrl: '',
    remarks: '',
    updatedAt: '',
    postDetails: [{ postDetailId: null, no1Content: '', no1Division: '1' }],
  });
  await flushPromises();
  const input = document.querySelector('.v-autocomplete input');
  input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  input.focus();
  await flushPromises();
  return wrapper;
}

afterEach(() => {
  document.body.innerHTML = '';
});

test('自分の投稿がある企業は無効な候補として、そのことを添えて表示する', async () => {
  const wrapper = await openCompanyMenu();
  expect(options()).toEqual([
    { title: '株式会社ABC', subtitle: undefined, disabled: false },
    {
      title: 'XYZ工業株式会社',
      subtitle: '自分の投稿があります',
      disabled: true,
    },
  ]);
  wrapper.unmount();
});

test('自分の投稿がある企業はクリックしても選ばれず、ほかの企業は選べる', async () => {
  const wrapper = await openCompanyMenu();
  const [notPosted, posted] = document.querySelectorAll('[role="option"]');
  posted.click();
  await flushPromises();
  expect(wrapper.vm.companyNumber).toBe('');
  notPosted.click();
  await flushPromises();
  expect(wrapper.vm.companyNumber).toBe('1000000000001');
  expect(wrapper.vm.companyName).toBe('株式会社ABC');
  wrapper.unmount();
});

// 消去アイコンを押すと、Vuetifyは検索文字列をnullで通知する
test('検索文字列がnullで通知されても、会社名を空文字で検索する', async () => {
  const wrapper = await openCompanyMenu();
  get.mockClear();
  wrapper
    .findComponent({ name: 'VAutocomplete' })
    .vm.$emit('update:search', null);
  await flushPromises();
  expect(get).toHaveBeenCalledWith('/companies/', {
    params: { companyName: '' },
  });
  wrapper.unmount();
});
