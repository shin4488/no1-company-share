<template>
  <AppCardList
    v-model="sharedCompanyPosts"
    :no1-divisions="no1Divisions"
    @add-bookmark="onAddedBookmark"
    @remove-bookmark="onRemovedBookmark"
    @confirm-report="onConfirmedReport"
    @click-edit="onEdited"
    @confirm-delete="onDeleted"
    @load-more="onLoadMore"
  ></AppCardList>
</template>

<script lang="ts">
import Vue from 'vue';
import { Context } from '@nuxt/types';
import { HomePageData } from '@f/definition/pages/home/data';
import { SharedPostGetRequestQuery } from '@f/definition/pages/common/apiSpec/sharedPostGetRequest';
import { SharedPostGetReponse } from '@f/definition/pages/common/apiSpec/sharedPostGetResponse';
import { AjaxHelper } from '@f/common/ajax/ajaxHelper';
import { SharedPostHandler } from '@f/common/ajax/sharedPostHandler';
import { ArrayUtil } from '@c/util/arrayUtil';

export default Vue.extend({
  name: 'HomePage',
  async asyncData({ $axios }: Context) {
    const request: SharedPostGetRequestQuery = {
      limit: 30,
      // 初回読み込み時は1ページ目
      offset: 1,
      // 初回読み込み時は1ページ目であるため、取得基準時刻は無し
      baseDateTime: null,
      isMyPostOnly: false,
    };
    const response = await AjaxHelper.get<SharedPostGetReponse>(
      $axios,
      '/localhost/shared-posts',
      request,
    );

    const { sharedCompanyPosts, no1Divisions } =
      SharedPostHandler.handleResponse(response);
    return {
      sharedCompanyPosts,
      no1Divisions,
    };
  },
  data(): HomePageData {
    return {
      sharedCompanyPosts: [],
      no1Divisions: [],
      loadedPage: 1,
    };
  },
  computed: {
    // 1度に30件取得固定としている
    limit: (): number => 30,
  },
  methods: {
    /**
     * お気に入り追加時処理
     */
    onAddedBookmark({ postId }: { postId: string }): void {
      console.log(postId);
      const bookmarkedPostIndex = this.sharedCompanyPosts.findIndex(
        (x) => x.postId === postId,
      );
      if (bookmarkedPostIndex === -1) {
        return;
      }

      // TODO:お気に入り登録処理
      this.sharedCompanyPosts[bookmarkedPostIndex].numberOfBookmarks++;
      this.sharedCompanyPosts[bookmarkedPostIndex].isBookmarkedByLoginUser =
        true;
    },
    /**
     * お気に入り解除時処理
     */
    onRemovedBookmark({ postId }: { postId: string }): void {
      console.log(postId);
      const bookmarkedPostIndex = this.sharedCompanyPosts.findIndex(
        (x) => x.postId === postId,
      );
      if (bookmarkedPostIndex === -1) {
        return;
      }

      // TODO:お気に入り登録処理
      this.sharedCompanyPosts[bookmarkedPostIndex].numberOfBookmarks--;
      this.sharedCompanyPosts[bookmarkedPostIndex].isBookmarkedByLoginUser =
        false;
    },
    /**
     * 投稿通報時処理
     */
    onConfirmedReport({ postId }: { postId: string }): void {
      console.log(postId);
    },
    /**
     * 投稿編集時処理
     */
    onEdited({ postId }: { postId: string }): void {
      // TODO:編集画面起動
      console.log(postId);
      const editedPost = this.sharedCompanyPosts.find(
        (x) => x.postId === postId,
      );
      if (editedPost === undefined) {
        return;
      }

      console.log(editedPost);
    },
    /**
     * 投稿削除時処理
     */
    onDeleted({ postId }: { postId: string }): void {
      console.log(postId);
    },
    /**
     * さらに表示処理
     */
    async onLoadMore(): Promise<void> {
      let baseDateTime: string | null = null;
      if (ArrayUtil.isNotEmpty(this.sharedCompanyPosts)) {
        const firstPost = this.sharedCompanyPosts[0];
        baseDateTime = firstPost.updatedAt;
      }

      const request: SharedPostGetRequestQuery = {
        limit: this.limit,
        // limit分増えていく
        offset: this.limit * this.loadedPage + 1,
        baseDateTime,
        isMyPostOnly: false,
      };
      const response = await AjaxHelper.get<SharedPostGetReponse>(
        this.$axios,
        '/localhost/shared-posts',
        request,
      );

      const { sharedCompanyPosts } = SharedPostHandler.handleResponse(response);
      this.sharedCompanyPosts.push(...sharedCompanyPosts);

      this.loadedPage++;
    },
  },
});
</script>
