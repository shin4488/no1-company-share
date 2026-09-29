import { mount } from '@vue/test-utils';
import SharedPostCard from '../components/SharedPostCard.vue';
import AddIconFixedButton from '../components/AddIconFixedButton.vue';

const passthrough = { template: '<div><slot name="prepend" /><slot /></div>' };
const stubs = Object.fromEntries(
  [
    'v-card',
    'v-card-title',
    'v-card-text',
    'v-card-actions',
    'v-list-item',
    'v-list-item-title',
    'v-row',
    'v-avatar',
  ].map((name) => [name, passthrough]),
);
stubs['v-icon'] = {
  template: '<i role="button" tabindex="0"><slot /></i>',
};
stubs['v-img'] = { template: '<img />' };
stubs['v-divider'] = { template: '<hr />' };

function mountCard(postingUserId = 'owner') {
  return mount(SharedPostCard, {
    props: {
      postId: 'post-1',
      companyNumber: 'company-1',
      postingUserId,
      isBookmarkedByLoginUser: false,
      numberOfBookmarks: 0,
      postDetails: [],
      no1Divisions: [],
    },
    global: {
      stubs,
      mocks: {
        $accessor: {
          firebaseAuthorization: { userIdComputed: 'owner' },
        },
      },
    },
  });
}

test('自分の投稿操作を読み上げられ、EnterとSpaceで起動できる', async () => {
  const wrapper = mountCard();
  const bookmark = wrapper.find('[aria-label="お気に入りに追加"]');
  const edit = wrapper.find('[aria-label="投稿を編集"]');
  const remove = wrapper.find('[aria-label="投稿を削除"]');

  await bookmark.trigger('keydown', { key: 'Enter' });
  await edit.trigger('keydown', { key: ' ' });
  await remove.trigger('keydown', { key: 'Enter' });

  expect(wrapper.emitted('add-bookmark')).toEqual([[{ postId: 'post-1' }]]);
  expect(wrapper.emitted('click-edit')).toEqual([[{ postId: 'post-1' }]]);
  expect(wrapper.emitted('confirm-delete')).toEqual([[{ postId: 'post-1' }]]);
  wrapper.unmount();
});

test('他人の投稿では通報とお気に入り解除をキーボードで起動できる', async () => {
  const wrapper = mountCard('other');
  await wrapper.setProps({ isBookmarkedByLoginUser: true });
  const bookmark = wrapper.find('[aria-label="お気に入りを解除"]');
  const report = wrapper.find('[aria-label="投稿を通報"]');

  await bookmark.trigger('keydown', { key: ' ' });
  await report.trigger('keydown', { key: 'Enter' });

  expect(wrapper.emitted('remove-bookmark')).toEqual([[{ postId: 'post-1' }]]);
  expect(wrapper.emitted('confirm-report')).toEqual([[{ postId: 'post-1' }]]);
  wrapper.unmount();
});

test('新規投稿ボタンには読み上げ名がある', () => {
  const wrapper = mount(AddIconFixedButton, {
    global: {
      stubs: {
        'v-btn': { template: '<button><slot /></button>' },
        'v-icon': { template: '<i><slot /></i>' },
      },
      mocks: { $vuetify: { display: { smAndDown: false } } },
    },
  });
  expect(wrapper.find('button').attributes('aria-label')).toBe('新規投稿');
  wrapper.unmount();
});
