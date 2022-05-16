<template>
  <div>
    <SharedPostCardList
      v-model="sharedPosts"
      message-if-no-data="まだお気に入りした投稿がありません。お気に入りを追加してみよう！"
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
import { PageHeadData } from '@f/definition/pages/common/headData';
import { SharedPost } from '@f/definition/common/sharedPost';
import { SelectItem } from '@f/definition/common/selectItem';
import { No1DivisionSelectItemGetResponse } from '@f/definition/common/apiSpec/no1DivisionSelectItemGetResponse';
import { SharedPostHandler } from '@f/common/ajax/sharedPostHandler';
import { AjaxHelper } from '@f/common/ajax/ajaxHelper';
import { postFetchedLimit } from '@f/common/constant/sharedPost';
import { BookmarkPageData } from '@f/definition/pages/bookmark/data';
import { BookmarkGetReponse } from '@f/definition/pages/bookmark/apiSpec/bookmarkGetResponse';
import { BookmarkGetRequestQuery } from '@f/definition/pages/bookmark/apiSpec/bookmarkGetRequest';

export default Vue.extend({
  name: 'BookmarkPage',
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

      const response = await AjaxHelper.get<
        BookmarkGetReponse,
        BookmarkGetRequestQuery
      >($axios, '/localhost/bookmarked-posts/', {
        limit: postFetchedLimit,
        // 初回読み込み時は1ページ目であるため、取得基準時刻は無し
        baseDateTime: null,
      });
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
  data(): BookmarkPageData {
    return {
      sharedPosts: [],
      no1Divisions: [],
      isLoadMoreButtonShown: false,
      oldBaseDateTime: '',
    };
  },
  head(): PageHeadData {
    return {
      title: 'お気に入り',
    };
  },
  methods: {
    /**
     * さらに表示処理ボタン押下処理
     */
    async onClickedLoadMoreButton(): Promise<void> {
      await this.$accessor.spinnerOverlay.open(async () => {
        const response = await AjaxHelper.get<
          BookmarkGetReponse,
          BookmarkGetRequestQuery
        >(this.$axios, '/bookmarked-posts/', {
          limit: postFetchedLimit,
          baseDateTime: this.oldBaseDateTime,
        });

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
