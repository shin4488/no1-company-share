import { computed, ref, watch } from 'vue';
import { useAsyncData, useNuxtApp } from '#app';
import { AjaxHelper } from '@f/common/ajax/ajaxHelper';
import { SharedPostHandler } from '@f/common/ajax/sharedPostHandler';
import { postFetchedLimit } from '@f/common/constant/sharedPost';
import type { SharedPost } from '@f/definition/common/sharedPost';
import type { SharedPostGetReponse } from '@f/definition/pages/common/apiSpec/sharedPostGetResponse';
import type { SharedPostGetRequestQuery } from '@f/definition/pages/common/apiSpec/sharedPostGetRequest';
import type { BookmarkGetReponse } from '@f/definition/pages/bookmark/apiSpec/bookmarkGetResponse';
import type { BookmarkGetRequestQuery } from '@f/definition/pages/bookmark/apiSpec/bookmarkGetRequest';
import type { No1DivisionSelectItemGetResponse } from '@f/definition/common/apiSpec/no1DivisionSelectItemGetResponse';

type PostList = 'home' | 'bookmark' | 'my-post';

export async function usePostList(list: PostList) {
  const { $axios, $accessor } = useNuxtApp();
  const fetchPosts = async (baseDateTime: string | null) => {
    if (list === 'bookmark') {
      const response = await AjaxHelper.get<
        BookmarkGetReponse,
        BookmarkGetRequestQuery
      >($axios, '/localhost/bookmarked-posts/', {
        limit: postFetchedLimit,
        baseDateTime,
      });
      return SharedPostHandler.handleResponse(response).sharedPosts;
    }
    const response = await AjaxHelper.get<
      SharedPostGetReponse,
      SharedPostGetRequestQuery
    >($axios, '/localhost/shared-posts/', {
      limit: postFetchedLimit,
      baseDateTime,
      isMyPostOnly: list === 'my-post',
    });
    return SharedPostHandler.handleResponse(response).sharedPosts;
  };

  const { data } = await useAsyncData(`posts:${list}`, async () => {
    const divisions = await AjaxHelper.get<No1DivisionSelectItemGetResponse>(
      $axios,
      '/divisions/no1/',
    );
    return {
      no1Divisions: SharedPostHandler.handleDivisionResponse(
        divisions?.no1DivisionSelectItems,
      ),
      sharedPosts: await fetchPosts(null),
    };
  });

  const sharedPosts = ref<SharedPost[]>(data.value?.sharedPosts || []);
  const no1Divisions = computed(() => data.value?.no1Divisions || []);
  const isLoadMoreButtonShown = ref(
    sharedPosts.value.length === postFetchedLimit,
  );
  watch(data, (result) => {
    sharedPosts.value = result?.sharedPosts || [];
    isLoadMoreButtonShown.value = sharedPosts.value.length === postFetchedLimit;
  });

  async function onClickedLoadMoreButton() {
    await $accessor.spinnerOverlay.open(async () => {
      const posts = await fetchPosts(
        SharedPostHandler.getOldBaseDateTime(sharedPosts.value),
      );
      sharedPosts.value = [...sharedPosts.value, ...posts];
      isLoadMoreButtonShown.value = posts.length === postFetchedLimit;
    });
  }

  return {
    sharedPosts,
    no1Divisions,
    isLoadMoreButtonShown,
    onClickedLoadMoreButton,
  };
}
