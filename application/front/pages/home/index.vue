<template>
  <AppCardList
    v-model="sharedCompanyPosts"
    :no1-divisions="no1Divisions"
    @add-bookmark="onAddedBookmark"
    @remove-bookmark="onRemovedBookmark"
    @confirm-report="onConfirmedReport"
    @click-edit="onEdited"
    @confirm-delete="onDeleted"
  ></AppCardList>
</template>

<script lang="ts">
import Vue from 'vue';
import { Context } from '@nuxt/types';
import { SelectItem } from '@f/definition/common/selectItem';
import { HomePageData } from '@f/definition/pages/home/data';
import { PostDetail, SharedPost } from '@f/definition/common/sharedPost';
import { SharedPostGetRequestQuery } from '@f/definition/pages/common/apiSpec/sharedPostGetRequest';
import { SharedPostGetReponse } from '@f/definition/pages/common/apiSpec/sharedPostGetResponse';
import { ApiResponse } from '@f/definition/common/apiSpec/apiResponse';
import { StringUtil } from '@c/util/stringUtil';

export default Vue.extend({
  name: 'HomePage',
  async asyncData({ $axios }: Context) {
    const request: SharedPostGetRequestQuery = {
      limit: 30,
      offset: 1,
      baseDateTime: null,
      isMyPostOnly: false,
    };
    const response = await $axios.get<ApiResponse<SharedPostGetReponse>>(
      '/localhost/shared-posts',
      {
        params: request,
      },
    );
    const responseBody = response.data;
    const responseBodyData = responseBody.data;
    if (responseBodyData === null) {
      return {
        sharedCompanyPosts: [],
        no1Divisions: [],
      };
    }

    const responsePosts = responseBodyData.posts;
    const responseDivisions = responseBodyData.no1Divisions;

    const sharedCompanyPosts: SharedPost[] = responsePosts.map((x) => ({
      postId: StringUtil.ifEmpty(x.id),
      companyNumber: StringUtil.ifEmpty(x.companyNumber),
      companyName: StringUtil.ifEmpty(x.companyName),
      companyHomepageUrl: StringUtil.ifEmpty(x.companyHomepageUrl),
      companyImageUrl: StringUtil.ifEmpty(x.companyImageUrl),
      postingUserId: StringUtil.ifEmpty(x.postingUserId),
      postingUserName: StringUtil.ifEmpty(x.postingUserName),
      postingUserIcomImageUrl: StringUtil.ifEmpty(x.postingUserIcomImageUrl),
      isBookmarkedByLoginUser: x.isBookmarkedByLoginUser || false,
      numberOfBookmarks: x.numberOfBookmarks || 0,
      remarks: StringUtil.ifEmpty(x.remarks),
      postDetails: x.postDetails.map<PostDetail>((y, index) => ({
        postDetailId: y.id || index,
        no1Content: StringUtil.ifEmpty(y.no1Content),
        no1Division: StringUtil.ifEmpty(y.no1Division),
      })),
    }));

    const no1Divisions: SelectItem[] = responseDivisions?.map((x) => ({
      text: StringUtil.ifEmpty(x.text),
      value: StringUtil.ifEmpty(x.value),
    }));

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
  },
});
</script>
