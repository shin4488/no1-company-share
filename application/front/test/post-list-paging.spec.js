import axios from 'axios';
import { defineComponent, h, Suspense } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import { useNuxtApp } from '#app';
import HomePage from '../pages/home/index.vue';
import BookmarkPage from '../pages/bookmark/index.vue';
import MyPostPage from '../pages/my-post/index.vue';
import LoadMoreButton from '../components/LoadMoreButton.vue';

// 一度に取得する投稿は12件まで
const limit = 12;

// 更新日時が新しい順に、n番目の投稿を返す
const post = (n) => ({
  id: `post-${n}`,
  companyNumber: '1000000000001',
  companyName: `企業${n}`,
  companyHomepageUrl: '',
  companyImageUrl: '',
  postingUserId: 'user-a',
  postingUserName: 'ユーザーA',
  postingUserIcomImageUrl: '',
  isBookmarkedByLoginUser: false,
  numberOfBookmarks: 0,
  remarks: '',
  updatedAt: new Date(Date.UTC(2026, 9, 1) - n * 60000).toISOString(),
  postDetails: [{ id: 1, no1Content: '生産量', no1Division: '1' }],
});
const posts = (from, count) =>
  Array.from({ length: count }, (_, i) => post(from + i));

// 送信直前で投稿の取得要求を記録し、用意した投稿を順に返す
function fakeApi(pages) {
  const requests = [];
  const api = axios.create({
    adapter: (config) => {
      const uri = new URL(api.getUri(config), 'http://localhost');
      const data = uri.pathname.startsWith('/divisions/')
        ? { no1DivisionSelectItems: [{ text: '生産', value: '1' }] }
        : { posts: pages[requests.push(uri) - 1] };
      return Promise.resolve({
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: { messages: [], data },
      });
    },
  });
  return { api, requests };
}

async function mountPage(page, pages) {
  const server = fakeApi(pages);
  useNuxtApp.mockReturnValue({
    $axios: server.api,
    $accessor: { spinnerOverlay: { open: (process) => process() } },
  });
  const wrapper = mount(
    defineComponent({ render: () => h(Suspense, null, [h(page)]) }),
    {
      global: {
        components: { LoadMoreButton },
        stubs: {
          SharedPostCardList: {
            props: ['modelValue'],
            template:
              '<ol><li v-for="item in modelValue" :key="item.postId">{{ item.postId }}</li></ol>',
          },
          'v-btn': { template: '<button><slot /></button>' },
        },
      },
    },
  );
  await flushPromises();
  const shownPostIds = () => wrapper.findAll('li').map((item) => item.text());
  const loadMoreButton = () =>
    wrapper.findAll('button').find((button) => button.text() === 'さらに表示');
  return { server, shownPostIds, loadMoreButton };
}

const ids = (from, count) => posts(from, count).map((x) => x.id);

describe.each([
  ['ホーム', HomePage, '/localhost/shared-posts/', { isMyPostOnly: 'false' }],
  [
    'マイ投稿',
    MyPostPage,
    '/localhost/shared-posts/',
    { isMyPostOnly: 'true' },
  ],
  ['お気に入り', BookmarkPage, '/localhost/bookmarked-posts/', {}],
])('%sの投稿一覧', (_, page, path, filter) => {
  test('12件ずつ取得し、表示中の最後の投稿より前に更新された投稿を末尾に追加する', async () => {
    const { server, shownPostIds, loadMoreButton } = await mountPage(page, [
      posts(0, limit),
      posts(limit, limit),
      [],
    ]);
    expect(shownPostIds()).toEqual(ids(0, limit));

    await loadMoreButton().trigger('click');
    await flushPromises();
    expect(shownPostIds()).toEqual(ids(0, limit * 2));
    // 取得した件数が上限と同じときは、続きがあり得るためボタンを残す
    expect(loadMoreButton()).toBeDefined();

    await loadMoreButton().trigger('click');
    await flushPromises();
    expect(shownPostIds()).toEqual(ids(0, limit * 2));
    expect(loadMoreButton()).toBeUndefined();

    const queries = server.requests.map((uri) => {
      expect(uri.pathname).toBe(path);
      return Object.fromEntries(uri.searchParams);
    });
    expect(queries).toEqual([
      { limit: String(limit), ...filter },
      {
        limit: String(limit),
        baseDateTime: post(limit - 1).updatedAt,
        ...filter,
      },
      {
        limit: String(limit),
        baseDateTime: post(limit * 2 - 1).updatedAt,
        ...filter,
      },
    ]);
  });

  test('取得した投稿が12件未満なら「さらに表示」を出さない', async () => {
    const { shownPostIds, loadMoreButton } = await mountPage(page, [
      posts(0, limit - 1),
    ]);
    expect(shownPostIds()).toEqual(ids(0, limit - 1));
    expect(loadMoreButton()).toBeUndefined();
  });

  test('追加で取得した投稿が12件未満なら「さらに表示」を消す', async () => {
    const { shownPostIds, loadMoreButton } = await mountPage(page, [
      posts(0, limit),
      posts(limit, 1),
    ]);
    await loadMoreButton().trigger('click');
    await flushPromises();
    expect(shownPostIds()).toEqual(ids(0, limit + 1));
    expect(loadMoreButton()).toBeUndefined();
  });
});
