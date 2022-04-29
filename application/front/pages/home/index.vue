<template>
  <div>
    <SharedPostCardList
      v-model="sharedPosts"
      :no1-divisions="no1Divisions"
      @confirm-report="onConfirmedReport"
    />
    <LoadMoreButton
      v-if="isLoadMoreButtonShown"
      text="さらに表示"
      @click="onClickedLoadMoreButton"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Context } from '@nuxt/types';
import { HomePageData } from '@f/definition/pages/home/data';
import { SharedPostGetRequestQuery } from '@f/definition/pages/common/apiSpec/sharedPostGetRequest';
import { SharedPostGetReponse } from '@f/definition/pages/common/apiSpec/sharedPostGetResponse';
import { AjaxHelper } from '@f/common/ajax/ajaxHelper';
import { SharedPostHandler } from '@f/common/ajax/sharedPostHandler';
import { postFetchedLimit } from '@f/common/constant/sharedPost';
import { SharedPost } from '@f/definition/common/sharedPost';
import { SelectItem } from '@f/definition/common/selectItem';

export default Vue.extend({
  name: 'HomePage',
  async asyncData({ $axios, $accessor }: Context) {
    const request: SharedPostGetRequestQuery = {
      limit: postFetchedLimit,
      // 初回読み込み時は1ページ目であるため、取得基準時刻は無し
      baseDateTime: null,
      isMyPostOnly: false,
    };

    let sharedPosts: SharedPost[] = [];
    let no1Divisions: SelectItem[] = [];
    // コンポーネントマウント前はストアアクセス不可のためスピナーは表示されない
    await $accessor.spinnerOverlay.open(async () => {
      const response = await AjaxHelper.get<SharedPostGetReponse>(
        $axios,
        '/localhost/shared-posts',
        request,
      );
      const results = SharedPostHandler.handleResponse(response);
      sharedPosts = results.sharedPosts;
      no1Divisions = results.no1Divisions;
    });

    // 1度に全データ取得しきれない場合は、さらに表示ボタンを表示
    const isLoadMoreButtonShown = sharedPosts.length === postFetchedLimit;
    const oldBaseDateTime = SharedPostHandler.getOldBaseDateTime(sharedPosts);

    return {
      sharedPosts,
      no1Divisions,
      isLoadMoreButtonShown,
      oldBaseDateTime,
    };
  },
  data(): HomePageData {
    return {
      sharedPosts: [],
      no1Divisions: [],
      isLoadMoreButtonShown: false,
      oldBaseDateTime: '',
    };
  },
  methods: {
    /**
     * 投稿通報時処理
     */
    onConfirmedReport({ postId }: { postId: string }): void {
      console.log(postId);
    },
    /**
     * さらに表示処理ボタン押下処理
     */
    async onClickedLoadMoreButton(): Promise<void> {
      const request: SharedPostGetRequestQuery = {
        limit: postFetchedLimit,
        baseDateTime: this.oldBaseDateTime,
        isMyPostOnly: false,
      };
      await this.$accessor.spinnerOverlay.open(async () => {
        const response = await AjaxHelper.get<SharedPostGetReponse>(
          this.$axios,
          '/localhost/shared-posts',
          request,
        );

        const { sharedPosts } = SharedPostHandler.handleResponse(response);
        this.sharedPosts.push(...sharedPosts);
        this.isLoadMoreButtonShown = sharedPosts.length === postFetchedLimit;
        this.oldBaseDateTime =
          SharedPostHandler.getOldBaseDateTime(sharedPosts);
      });
    },
  },
});
</script>
