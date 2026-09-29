import { reactive, nextTick } from 'vue';
import { shallowMount } from '@vue/test-utils';
import SharedPostCardList from '../components/SharedPostCardList.vue';
import ReportDialog from '../components/ReportDialog.vue';
import { AjaxHelper } from '../common/ajax/ajaxHelper';

const post = (postId = 'one', bookmarked = false) => ({
  postId,
  isBookmarkedByLoginUser: bookmarked,
  numberOfBookmarks: bookmarked ? 1 : 0,
});
function mountList(posts = [post()], path = '/home') {
  const state = reactive({ userIdComputed: 'owner' });
  const request = jest
    .fn()
    .mockResolvedValue({ data: { messages: [], data: null } });
  const info = jest.fn();
  const error = jest.fn();
  const wrapper = shallowMount(SharedPostCardList, {
    props: { modelValue: posts },
    global: {
      stubs: [
        'v-row',
        'v-col',
        'SharedPostCard',
        'AddIconFixedButton',
        'ConfirmDialog',
        'ReportDialog',
        'SharedPostDialog',
      ],
      mocks: {
        $axios: { request },
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
  return { wrapper, request, state, info, error };
}
const later = () => {
  let complete;
  const promise = new Promise((resolve) => {
    complete = resolve;
  });
  return { promise, resolve: complete };
};
const success = { data: { messages: [], data: null } };

test('お気に入りは保存成功後だけ更新し、連打中は重複送信しない', async () => {
  const { wrapper, request } = mountList();
  const pending = later();
  request.mockReturnValue(pending.promise);
  const write = wrapper.vm.onAddedBookmark({ postId: 'one' });
  await wrapper.vm.onAddedBookmark({ postId: 'one' });
  expect(request).toHaveBeenCalledTimes(1);
  expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  pending.resolve(success);
  await write;
  expect(wrapper.emitted('update:modelValue')[0][0]).toEqual([
    post('one', true),
  ]);
  wrapper.unmount();
});

test.each([false, true])(
  '保存失敗ではお気に入り状態=%sと件数を変えず再試行できる',
  async (bookmarked) => {
    const { wrapper, request } = mountList([post('one', bookmarked)]);
    request.mockRejectedValueOnce(new Error('500'));
    const method = bookmarked ? 'onRemovedBookmark' : 'onAddedBookmark';
    await wrapper.vm[method]({ postId: 'one' });
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    await wrapper.vm[method]({ postId: 'one' });
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
    wrapper.unmount();
  },
);

test('お気に入り一覧では解除の保存後に対象カードを除く', async () => {
  const { wrapper } = mountList(
    [post('one', true), post('two', true)],
    '/bookmark',
  );
  await wrapper.vm.onRemovedBookmark({ postId: 'one' });
  expect(wrapper.emitted('update:modelValue')[0][0]).toEqual([
    post('two', true),
  ]);
  wrapper.unmount();
});

test('ログアウト後に届いた保存結果で表示を上書きしない', async () => {
  const { wrapper, request, state } = mountList();
  const pending = later();
  request.mockReturnValue(pending.promise);
  const write = wrapper.vm.onAddedBookmark({ postId: 'one' });
  state.userIdComputed = null;
  pending.resolve(success);
  await write;
  expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  await wrapper.vm.onAddedBookmark({ postId: 'one' });
  expect(request).toHaveBeenCalledTimes(1);
  wrapper.unmount();
});

test('削除に失敗したカードを消さず成功通知もしない', async () => {
  const { wrapper, request, info } = mountList();
  wrapper.vm.$refs.confirmDialog.open = jest.fn().mockResolvedValue(true);
  request.mockRejectedValue(new Error('network'));
  await wrapper.vm.onDeleted({ postId: 'one' });
  expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  expect(info).not.toHaveBeenCalled();
  wrapper.unmount();
});

test('削除の待機中に一覧の順番が変わっても対象投稿だけを除く', async () => {
  const { wrapper, request } = mountList([post(), post('two')]);
  wrapper.vm.$refs.confirmDialog.open = jest.fn().mockResolvedValue(true);
  const pending = later();
  request.mockReturnValue(pending.promise);
  const write = wrapper.vm.onDeleted({ postId: 'one' });
  await nextTick();
  await wrapper.setProps({ modelValue: [post('two'), post()] });
  pending.resolve(success);
  await write;
  expect(wrapper.emitted('update:modelValue')[0][0]).toEqual([post('two')]);
  wrapper.unmount();
});

test('削除キャンセルではAPIを呼ばない', async () => {
  const { wrapper, request } = mountList();
  wrapper.vm.$refs.confirmDialog.open = jest.fn().mockResolvedValue(false);
  await wrapper.vm.onDeleted({ postId: 'one' });
  expect(request).not.toHaveBeenCalled();
  wrapper.unmount();
});

test.each([true, false])(
  '通報の保存成功=%sを画面の結果に反映する',
  async (succeeds) => {
    const info = jest.fn();
    const request = succeeds
      ? jest.fn().mockResolvedValue(success)
      : jest.fn().mockRejectedValue(new Error('offline'));
    const wrapper = shallowMount(ReportDialog, {
      global: {
        stubs: [
          'v-dialog',
          'v-card',
          'v-card-text',
          'v-row',
          'v-col',
          'v-textarea',
          'v-card-actions',
          'v-btn',
        ],
        mocks: {
          $axios: { request },
          $accessor: {
            spinnerOverlay: { open: (task) => task() },
            snackBarInfo: { open: info },
          },
        },
      },
    });
    const outcome = wrapper.vm.open({ postId: 'one' });
    await wrapper.setData({ postId: 'one', reportDetail: 'test report' });
    await wrapper.vm.onClickedConfirmButton();
    expect(wrapper.vm.isDialogShow).toBe(!succeeds);
    if (succeeds) {
      await expect(outcome).resolves.toBe(true);
    } else {
      wrapper.vm.onClickedCancelButton();
      await expect(outcome).resolves.toBe(false);
    }
    expect(info.mock.calls.length).toBe(succeeds ? 1 : 0);
    wrapper.unmount();
  },
);

test.each([undefined, { messages: [{ message: 'invalid' }], data: null }])(
  '不正な応答やAPIエラーを成功扱いしない',
  async (data) => {
    expect(
      await AjaxHelper.submit(
        { request: () => Promise.resolve({ data }) },
        'post',
        '/test',
      ),
    ).toBe(false);
  },
);
