<template>
  <div>
    <SharedPostCardList
      v-model="sharedCompanyPosts"
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
import { ArrayUtil } from '@c/util/arrayUtil';
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

    let sharedCompanyPosts: SharedPost[] = [];
    let no1Divisions: SelectItem[] = [];
    // コンポーネントマウント前はストアアクセス不可のためスピナーは表示されない
    await $accessor.spinnerOverlay.open(async () => {
      const response = await AjaxHelper.get<SharedPostGetReponse>(
        $axios,
        '/localhost/shared-posts',
        request,
      );
      const results = SharedPostHandler.handleResponse(response);
      sharedCompanyPosts = results.sharedCompanyPosts;
      no1Divisions = results.no1Divisions;
    });

    // 1度に全データ取得しきれない場合は、さらに表示ボタンを表示
    const isLoadMoreButtonShown =
      sharedCompanyPosts.length === postFetchedLimit;

    return {
      sharedCompanyPosts,
      no1Divisions,
      isLoadMoreButtonShown,
    };
  },
  data(): HomePageData {
    return {
      sharedCompanyPosts: [],
      no1Divisions: [],
      isLoadMoreButtonShown: false,
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
      let baseDateTime: string | null = null;
      if (ArrayUtil.isNotEmpty(this.sharedCompanyPosts)) {
        const lastPostIndex = this.sharedCompanyPosts.length - 1;
        const lastPost = this.sharedCompanyPosts[lastPostIndex];
        baseDateTime = lastPost.updatedAt;
      }

      const request: SharedPostGetRequestQuery = {
        limit: postFetchedLimit,
        baseDateTime,
        isMyPostOnly: false,
      };
      await this.$accessor.spinnerOverlay.open(async () => {
        const response = await AjaxHelper.get<SharedPostGetReponse>(
          this.$axios,
          '/localhost/shared-posts',
          request,
        );

        const { sharedCompanyPosts } =
          SharedPostHandler.handleResponse(response);
        this.sharedCompanyPosts.push(...sharedCompanyPosts);
        this.isLoadMoreButtonShown =
          sharedCompanyPosts.length === postFetchedLimit;
      });
    },
  },
});
</script>
