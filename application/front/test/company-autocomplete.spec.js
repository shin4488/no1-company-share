import axios from 'axios';
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

// 送信直前で要求を記録し、会社検索と投稿のAPIの応答を返す
let requests;
const api = axios.create({
  adapter: (config) => {
    const request = {
      method: config.method,
      url: config.url,
      params: config.params,
      body: config.data === undefined ? undefined : JSON.parse(config.data),
    };
    requests.push(request);
    const data =
      request.method === 'get' && request.url === '/companies/'
        ? { companies }
        : { posts: [{ id: 'post-1', updatedAt: '2026-10-01T00:00:00.000Z' }] };
    return Promise.resolve({
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: { messages: [], data },
    });
  },
});
// 描画中の例外は、Vueのエラーハンドラーで受けて確かめる
const errorHandler = vi.fn();

async function openCompanyMenu() {
  requests = [];
  errorHandler.mockReset();
  const wrapper = mount(SharedPostDialog, {
    attachTo: document.body,
    props: { no1Divisions: [{ text: '世界一', value: '1' }] },
    global: {
      plugins: [createVuetify({ components, directives })],
      config: { errorHandler },
      stubs: { ConfirmDialog: true, Spinner: true },
      mocks: {
        $axios: api,
        $accessor: {
          spinnerOverlay: { open: (task) => task() },
          snackBarInfo: { open: vi.fn() },
        },
      },
    },
  });
  // 企業以外の必須項目は入力済みにして、企業の選択だけで確定できるかが決まるようにする
  wrapper.vm.open({
    postId: '',
    companyNumber: '',
    companyName: '',
    companyHomepageUrl: '',
    companyImageUrl: '',
    remarks: '',
    updatedAt: '',
    postDetails: [
      { postDetailId: null, no1Content: '県内1位', no1Division: '1' },
    ],
  });
  await flushPromises();
  const input = document.querySelector('.v-autocomplete input');
  input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  input.focus();
  await flushPromises();
  return wrapper;
}

const confirmButton = () =>
  [...document.querySelectorAll('button')].find(
    (button) => button.textContent.trim() === '確定',
  );

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

test('自分の投稿がある企業はクリックしても選ばれず、ほかの企業は選んで投稿できる', async () => {
  const wrapper = await openCompanyMenu();
  const [notPosted, posted] = document.querySelectorAll('[role="option"]');
  posted.click();
  await flushPromises();
  expect(confirmButton().disabled).toBe(true);
  notPosted.click();
  await flushPromises();
  confirmButton().click();
  await flushPromises();
  const posts = requests.filter((request) => request.method === 'post');
  expect(posts.map((request) => request.url)).toEqual(['/shared-posts/']);
  expect(posts[0].body.posts).toEqual([
    expect.objectContaining({
      companyNumber: '1000000000001',
      companyName: '株式会社ABC',
    }),
  ]);
  wrapper.unmount();
});

// 消去アイコンを押すと、Vuetifyは検索文字列をnullで通知する
test('検索文字列がnullで通知されても、会社名を空文字で検索する', async () => {
  const wrapper = await openCompanyMenu();
  requests = [];
  wrapper
    .findComponent({ name: 'VAutocomplete' })
    .vm.$emit('update:search', null);
  await flushPromises();
  expect(requests).toEqual([
    {
      method: 'get',
      url: '/companies/',
      params: { companyName: '' },
      body: undefined,
    },
  ]);
  wrapper.unmount();
});

const companyInput = () =>
  document.querySelector('.v-autocomplete input[type="text"]');
const typeCompanyName = async (text) => {
  companyInput().value = text;
  companyInput().dispatchEvent(new Event('input', { bubbles: true }));
  await flushPromises();
};
const selectNotPostedCompany = async () => {
  document.querySelector('[role="option"]').click();
  await flushPromises();
};
const clickClearIcon = async () => {
  document.querySelector('.v-autocomplete .v-field__clearable i').click();
  await flushPromises();
};

test.each([
  [
    '入力した文字をBackspaceで消す',
    async () => {
      await typeCompanyName('ＡＢＣ');
      await typeCompanyName('');
    },
  ],
  [
    '入力した文字を消去アイコンで消す',
    async () => {
      await typeCompanyName('ＡＢＣ');
      await clickClearIcon();
    },
  ],
  [
    '選んだ企業を消去アイコンで消す',
    async () => {
      await selectNotPostedCompany();
      await clickClearIcon();
    },
  ],
  [
    '選んだ企業名をBackspaceで消す',
    async () => {
      await selectNotPostedCompany();
      await typeCompanyName('');
    },
  ],
])(
  '%sと、例外を出さずに企業の選択が外れて確定できなくなる',
  async (_, clearInput) => {
    const wrapper = await openCompanyMenu();
    await clearInput();
    expect(errorHandler).not.toHaveBeenCalled();
    expect(companyInput().value).toBe('');
    expect(confirmButton().disabled).toBe(true);
    wrapper.unmount();
  },
);
