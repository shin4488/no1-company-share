<template>
  <div>
    <SharedPostCardList
      v-model="sharedPosts"
      message-if-no-data="まだ投稿がありません。最初の投稿をしてみよう！"
      :no1-divisions="no1Divisions"
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
import { SelectItem } from '@f/definition/common/selectItem';
import { AjaxHelper } from '@f/common/ajax/ajaxHelper';
import { SharedPostHandler } from '@f/common/ajax/sharedPostHandler';
import { SharedPost } from '@f/definition/common/sharedPost';
import { HomePageData } from '@f/definition/pages/home/data';
import { SharedPostGetReponse } from '@f/definition/pages/common/apiSpec/sharedPostGetResponse';
import { postFetchedLimit } from '@f/common/constant/sharedPost';
import { No1DivisionSelectItemGetResponse } from '@s/feature/division/definition/no1DivisionSelectItemGetResponse';
import { PageHeadData } from '@f/definition/pages/common/headData';

export default Vue.extend({
  name: 'HomePage',
  async asyncData({ $axios, $accessor }: Context) {
    let sharedPosts: SharedPost[] = [];
    let no1Divisions: SelectItem[] = [];

    // コンポーネントマウント前はストアアクセス不可のためスピナーは表示されない
    await $accessor.spinnerOverlay.open(async () => {
      const no1DivisionsReponse =
        await AjaxHelper.get<No1DivisionSelectItemGetResponse>(
          $axios,
          '/divisions/no1/',
        );
      no1Divisions = SharedPostHandler.handleDivisionResponse(
        no1DivisionsReponse?.no1DivisionSelectItems,
      );

      const response = await AjaxHelper.get<SharedPostGetReponse>(
        $axios,
        '/localhost/shared-posts/',
        {
          limit: postFetchedLimit,
          // 初回読み込み時は1ページ目であるため、取得基準時刻は無し
          baseDateTime: null,
          isMyPostOnly: false,
        },
      );
      const results = SharedPostHandler.handleResponse(response);
      sharedPosts = results.sharedPosts;
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
  head(): PageHeadData {
    return {
      title: 'ホーム',
    };
  },
  methods: {
    /**
     * さらに表示処理ボタン押下処理
     */
    async onClickedLoadMoreButton(): Promise<void> {
      await this.$accessor.spinnerOverlay.open(async () => {
        const response = await AjaxHelper.get<SharedPostGetReponse>(
          this.$axios,
          '/localhost/shared-posts/',
          {
            limit: postFetchedLimit,
            baseDateTime: this.oldBaseDateTime,
            isMyPostOnly: false,
          },
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
