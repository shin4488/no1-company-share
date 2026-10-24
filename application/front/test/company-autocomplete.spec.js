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
  { number: '1000000000001', name: '株式会社ＡＢＣ', isRegistered: false },
  { number: '1000000000002', name: 'ＸＹＺ工業株式会社', isRegistered: true },
];

const options = () =>
  [...document.querySelectorAll('[role="option"]')].map((el) => ({
    title: el.querySelector('.v-list-item-title').textContent.trim(),
    subtitle: el.querySelector('.v-list-item-subtitle')?.textContent.trim(),
    disabled: el.classList.contains('v-list-item--disabled'),
  }));

async function openCompanyMenu() {
  const get = vi.fn().mockResolvedValue({
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

test('登録済みの企業は無効な候補として、登録済みであることを添えて表示する', async () => {
  const wrapper = await openCompanyMenu();
  expect(options()).toEqual([
    { title: '株式会社ABC', subtitle: undefined, disabled: false },
    { title: 'XYZ工業株式会社', subtitle: '登録済みです', disabled: true },
  ]);
  wrapper.unmount();
});

test('登録済みの企業はクリックしても選ばれず、未登録の企業は選べる', async () => {
  const wrapper = await openCompanyMenu();
  const [unregistered, registered] =
    document.querySelectorAll('[role="option"]');
  registered.click();
  await flushPromises();
  expect(wrapper.vm.companyNumber).toBe('');
  unregistered.click();
  await flushPromises();
  expect(wrapper.vm.companyNumber).toBe('1000000000001');
  expect(wrapper.vm.companyName).toBe('株式会社ABC');
  wrapper.unmount();
});
