<template>
  <div>
    <SharedPostCardList
      v-model="sharedCompanyPosts"
      :no1-divisions="no1Divisions"
      @add-bookmark="onAddedBookmark"
      @remove-bookmark="onRemovedBookmark"
      @confirm-report="onConfirmedReport"
      @click-edit="onEdited"
      @confirm-delete="onDeleted"
    />
    <SharedPostDialog ref="sharedPostDialog" :no1-divisions="no1Divisions" />

    <LoadMoreButton
      v-if="isLoadMoreButtonShown"
      text="さらに表示"
      @click="onClickedLoadMoreButton"
    />
    <AddIconFixedButton @click="onClickedAddPostButton" />
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
import SharedPostDialog from '@f/components/SharedPostDialog.vue';
import { SharedPostDialogParameter } from '@f/definition/components/sharedPostDialog/parameter';
import { SharedPostDialogResult } from '@f/definition/components/sharedPostDialog/result';
import { StringUtil } from '@c/util/stringUtil';

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
    async onEdited({ postId }: { postId: string }): Promise<void> {
      const editedPostIndex = this.sharedCompanyPosts.findIndex(
        (x) => x.postId === postId,
      );
      if (editedPostIndex === -1) {
        return;
      }

      const editedPost = this.sharedCompanyPosts[editedPostIndex];
      const parameter: SharedPostDialogParameter = {
        postId: editedPost.postId,
        companyNumber: editedPost.companyNumber,
        companyName: editedPost.companyName,
        companyHomepageUrl: editedPost.companyHomepageUrl,
        companyImageUrl: editedPost.companyImageUrl,
        remarks: editedPost.remarks,
        updatedAt: editedPost.updatedAt,
        postDetails: editedPost.postDetails.map((x) => ({
          postDetailId: x.postDetailId,
          no1Content: x.no1Content,
          no1Division: x.no1Division,
        })),
      };
      const result = await this.openSharedPostDialog(parameter);
      if (result === undefined) {
        return;
      }

      console.log(result);
      editedPost.postId = result.postId;
      editedPost.companyNumber = result.companyNumber;
      editedPost.companyName = result.companyName;
      editedPost.companyHomepageUrl = result.companyHomepageUrl;
      editedPost.companyImageUrl = result.companyImageUrl;
      editedPost.remarks = result.remarks;
      editedPost.updatedAt = result.updatedAt;
      editedPost.postDetails = result.postDetails.map((x) => ({
        postDetailId: x.postDetailId,
        no1Content: x.no1Content,
        no1Division: x.no1Division,
      }));
      this.sharedCompanyPosts[editedPostIndex] = editedPost;
    },
    /**
     * 投稿削除時処理
     */
    onDeleted({ postId }: { postId: string }): void {
      console.log(postId);
    },
    /**
     * 新規投稿追加ボタン押下処理
     */
    async onClickedAddPostButton(): Promise<void> {
      const firebaseLoginUserId =
        this.$accessor.firebaseAuthorization.userIdComputed;
      if (StringUtil.isEmpty(firebaseLoginUserId)) {
        this.$accessor.snackBarError.open('投稿するにはログインしてください。');
        return;
      }

      let firstNo1Division = '';
      if (ArrayUtil.isNotEmpty(this.no1Divisions)) {
        firstNo1Division = this.no1Divisions[0].value;
      }

      const parameter: SharedPostDialogParameter = {
        postId: '',
        companyNumber: '',
        companyName: '',
        companyHomepageUrl: '',
        companyImageUrl: '',
        remarks: '',
        updatedAt: '',
        postDetails: [
          {
            postDetailId: null,
            no1Content: '',
            no1Division: firstNo1Division,
          },
        ],
      };
      const result = await this.openSharedPostDialog(parameter);
      if (result === undefined) {
        return;
      }

      const newPost: SharedPost = {
        postId: result.postId,
        companyNumber: result.companyNumber,
        companyName: result.companyName,
        companyHomepageUrl: result.companyHomepageUrl,
        companyImageUrl: result.companyImageUrl,
        postingUserId: StringUtil.ifEmpty(
          this.$accessor.firebaseAuthorization.userIdComputed,
        ),
        postingUserName: StringUtil.ifEmpty(
          this.$fireModule.auth().currentUser?.displayName,
        ),
        postingUserIcomImageUrl: StringUtil.ifEmpty(
          this.$fireModule.auth().currentUser?.photoURL,
        ),
        isBookmarkedByLoginUser: false,
        numberOfBookmarks: 0,
        remarks: result.remarks,
        updatedAt: result.updatedAt,
        postDetails: result.postDetails.map((x) => ({
          postDetailId: x.postDetailId,
          no1Content: x.no1Content,
          no1Division: x.no1Division,
        })),
      };
      // 新規作成したデータは最新投稿であるため、最上位に表示
      this.sharedCompanyPosts.unshift(newPost);
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
    async openSharedPostDialog(
      parameter: SharedPostDialogParameter,
    ): Promise<SharedPostDialogResult | void> {
      const sharedPostDialog = this.$refs.sharedPostDialog as InstanceType<
        typeof SharedPostDialog
      >;

      const result = await sharedPostDialog.open(parameter);
      return result;
    },
  },
});
</script>
