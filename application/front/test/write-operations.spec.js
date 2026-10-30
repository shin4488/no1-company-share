import axios from 'axios';
import { reactive } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import SharedPostCardList from '../components/SharedPostCardList.vue';
import ReportDialog from '../components/ReportDialog.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import { AjaxHelper } from '../common/ajax/ajaxHelper';

const post = (postId = 'one', bookmarked = false) => ({
  postId,
  isBookmarkedByLoginUser: bookmarked,
  numberOfBookmarks: bookmarked ? 1 : 0,
});
const success = { messages: [], data: null };
const later = () => {
  let complete;
  const promise = new Promise((resolve) => {
    complete = resolve;
  });
  return { promise, resolve: complete };
};

// 送信直前で要求を記録し、応答はテストごとに決める
function fakeApi() {
  const requests = [];
  let respond = () => Promise.resolve(success);
  const api = axios.create({
    adapter: async (config) => {
      requests.push({
        method: config.method,
        url: config.url,
        body: config.data === undefined ? undefined : JSON.parse(config.data),
      });
      const data = await respond();
      return { status: 200, statusText: 'OK', headers: {}, config, data };
    },
  });
  return {
    api,
    requests,
    respondWith(next) {
      respond = next;
    },
  };
}

const passthrough = { template: '<div><slot /></div>' };
const dialogStubs = {
  'v-dialog': {
    props: ['modelValue'],
    template: '<div v-if="modelValue" role="dialog"><slot /></div>',
  },
  'v-card': passthrough,
  'v-card-title': passthrough,
  'v-card-text': passthrough,
  'v-card-actions': passthrough,
  'v-row': passthrough,
  'v-col': passthrough,
  'v-btn': { template: '<button><slot /></button>' },
};
const clickButton = async (wrapper, label) => {
  await wrapper
    .findAll('button')
    .find((button) => button.text() === label)
    .trigger('click');
  await flushPromises();
};

function mountList(posts = [post()], path = '/home') {
  const state = reactive({ userIdComputed: 'owner' });
  const server = fakeApi();
  const info = vi.fn();
  const error = vi.fn();
  const wrapper = mount(SharedPostCardList, {
    props: { modelValue: posts },
    global: {
      // Nuxtが自動で登録する部品のうち、削除の確認ダイアログは本物を使う
      components: { ConfirmDialog },
      stubs: {
        ...dialogStubs,
        SharedPostCard: {
          name: 'SharedPostCard',
          props: ['postId'],
          template: '<article />',
        },
        AddIconFixedButton: true,
        ReportDialog: true,
        SharedPostDialog: true,
      },
      mocks: {
        $axios: server.api,
        $accessor: {
          firebaseAuthorization: state,
          snackBarError: { open: error },
          snackBarInfo: { open: info },
        },
        $cloner: { deepClone: (value) => JSON.parse(JSON.stringify(value)) },
        $route: { path },
      },
    },
  });
  // 投稿カードの操作として、カードが親へ通知するイベントを送る
  const operateCard = async (event, postId = 'one') => {
    wrapper
      .findAllComponents({ name: 'SharedPostCard' })
      .find((card) => card.props('postId') === postId)
      .vm.$emit(event, { postId });
    await flushPromises();
  };
  return { wrapper, server, state, info, error, operateCard };
}

test('お気に入りは保存成功後だけ更新し、連打中は重複送信しない', async () => {
  const { wrapper, server, operateCard } = mountList();
  const pending = later();
  server.respondWith(() => pending.promise);
  await operateCard('add-bookmark');
  await operateCard('add-bookmark');
  expect(server.requests).toEqual([
    { method: 'post', url: '/bookmarked-posts/one', body: undefined },
  ]);
  expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  pending.resolve(success);
  await flushPromises();
  expect(wrapper.emitted('update:modelValue')).toEqual([[[post('one', true)]]]);
  wrapper.unmount();
});

test.each([false, true])(
  '保存失敗ではお気に入り状態=%sと件数を変えず再試行できる',
  async (bookmarked) => {
    const { wrapper, server, operateCard } = mountList([
      post('one', bookmarked),
    ]);
    const event = bookmarked ? 'remove-bookmark' : 'add-bookmark';
    server.respondWith(() => Promise.reject(new Error('500')));
    await operateCard(event);
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    server.respondWith(() => Promise.resolve(success));
    await operateCard(event);
    expect(server.requests.map((request) => request.method)).toEqual(
      bookmarked ? ['delete', 'delete'] : ['post', 'post'],
    );
    expect(wrapper.emitted('update:modelValue')).toEqual([
      [[post('one', !bookmarked)]],
    ]);
    wrapper.unmount();
  },
);

test('お気に入り一覧では解除の保存後に対象カードを除く', async () => {
  const { wrapper, operateCard } = mountList(
    [post('one', true), post('two', true)],
    '/bookmark',
  );
  await operateCard('remove-bookmark');
  expect(wrapper.emitted('update:modelValue')).toEqual([[[post('two', true)]]]);
  wrapper.unmount();
});

test('ログアウト後に届いた保存結果で表示を上書きしない', async () => {
  const { wrapper, server, state, operateCard } = mountList();
  const pending = later();
  server.respondWith(() => pending.promise);
  await operateCard('add-bookmark');
  state.userIdComputed = null;
  pending.resolve(success);
  await flushPromises();
  expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  await operateCard('add-bookmark');
  expect(server.requests).toHaveLength(1);
  wrapper.unmount();
});

test('削除に失敗したカードを消さず成功通知もしない', async () => {
  const { wrapper, server, info, operateCard } = mountList();
  server.respondWith(() => Promise.reject(new Error('network')));
  await operateCard('confirm-delete');
  await clickButton(wrapper, 'はい');
  expect(server.requests).toEqual([
    { method: 'delete', url: '/shared-posts/one', body: undefined },
  ]);
  expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  expect(info).not.toHaveBeenCalled();
  wrapper.unmount();
});

test('削除の待機中に一覧の順番が変わっても対象投稿だけを除く', async () => {
  const { wrapper, server, info, operateCard } = mountList([
    post(),
    post('two'),
  ]);
  const pending = later();
  server.respondWith(() => pending.promise);
  await operateCard('confirm-delete');
  await clickButton(wrapper, 'はい');
  await wrapper.setProps({ modelValue: [post('two'), post()] });
  pending.resolve(success);
  await flushPromises();
  expect(wrapper.emitted('update:modelValue')).toEqual([[[post('two')]]]);
  expect(info).toHaveBeenCalledWith('投稿を削除しました。');
  wrapper.unmount();
});

test('削除キャンセルではAPIを呼ばない', async () => {
  const { wrapper, server, operateCard } = mountList();
  await operateCard('confirm-delete');
  await clickButton(wrapper, 'いいえ');
  expect(server.requests).toEqual([]);
  expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  wrapper.unmount();
});

describe('通報', () => {
  async function openReportDialog() {
    const server = fakeApi();
    const info = vi.fn();
    const wrapper = mount(ReportDialog, {
      global: {
        stubs: {
          ...dialogStubs,
          'v-textarea': {
            props: ['modelValue'],
            emits: ['update:modelValue'],
            template:
              '<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
          },
        },
        mocks: {
          $axios: server.api,
          $accessor: {
            spinnerOverlay: { open: (task) => task() },
            snackBarInfo: { open: info },
          },
        },
      },
    });
    // 投稿一覧は、ダイアログを開いて通報したかどうかの結果を待つ
    const outcome = wrapper.vm.open({ postId: 'one' });
    await flushPromises();
    return { wrapper, server, info, outcome };
  }
  const report = async (wrapper) => {
    await wrapper.find('textarea').setValue('test report');
    await clickButton(wrapper, '通報');
  };

  test('通報を保存できたらダイアログを閉じ、通報したことを伝える', async () => {
    const { wrapper, server, info, outcome } = await openReportDialog();
    await report(wrapper);
    expect(server.requests).toEqual([
      {
        method: 'post',
        url: '/reported-shared-posts/',
        body: { posts: [{ id: 'one', reportDetail: 'test report' }] },
      },
    ]);
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false);
    await expect(outcome).resolves.toBe(true);
    expect(info).toHaveBeenCalledWith('投稿を通報しました。');
    wrapper.unmount();
  });

  test('通報の保存に失敗したらダイアログを開いたままにし、キャンセルで通報なしとして閉じる', async () => {
    const { wrapper, server, info, outcome } = await openReportDialog();
    server.respondWith(() => Promise.reject(new Error('offline')));
    await report(wrapper);
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
    await clickButton(wrapper, 'キャンセル');
    await expect(outcome).resolves.toBe(false);
    expect(info).not.toHaveBeenCalled();
    wrapper.unmount();
  });
});

test.each([undefined, { messages: [{ message: 'invalid' }], data: null }])(
  '不正な応答やAPIエラーを成功扱いしない',
  async (data) => {
    const server = fakeApi();
    server.respondWith(() => Promise.resolve(data));
    expect(await AjaxHelper.submit(server.api, 'post', '/test')).toBe(false);
  },
);
