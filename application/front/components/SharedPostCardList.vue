<template>
  <div>
    <v-row>
      <v-col v-show="hasNoItem">{{ messageIfNoData }}</v-col>

      <!-- xsだけは指定できないため、cols指定となる -->
      <v-col
        v-for="(item, index) in value"
        :key="index"
        xl="3"
        md="4"
        sm="6"
        cols="12"
      >
        <SharedPostCard
          v-model="item.postId"
          :company-number="item.companyNumber"
          :company-name="item.companyName"
          :company-homepage-url="item.companyHomepageUrl"
          :company-image-url="item.companyImageUrl"
          :posting-user-id="item.postingUserId"
          :posting-user-name="item.postingUserName"
          :posting-user-icom-image-url="item.postingUserIcomImageUrl"
          :is-bookmarked-by-login-user="item.isBookmarkedByLoginUser"
          :number-of-bookmarks="item.numberOfBookmarks"
          :remarks="item.remarks"
          :post-details="item.postDetails"
          :no1-divisions="no1Divisions"
          @add-bookmark="onAddedBookmark"
          @remove-bookmark="onRemovedBookmark"
          @confirm-report="onConfirmedReport"
          @click-edit="onEdited"
          @confirm-delete="onDeleted"
        />
      </v-col>
    </v-row>

    <ConfirmDialog ref="confirmDialog" />
    <ReportDialog ref="reportDialog" />
    <SharedPostDialog ref="sharedPostDialog" :no1-divisions="no1Divisions" />
    <AddIconFixedButton v-show="isLogined" @click="onClickedAddPostButton" />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import SharedPostDialog from '@f/components/SharedPostDialog.vue';
import ReportDialog from '@f/components/ReportDialog.vue';
import ConfirmDialog from '@f/components/ConfirmDialog.vue';
import { AjaxHelper } from '@f/common/ajax/ajaxHelper';
import { SelectItem } from '@f/definition/common/selectItem';
import { SharedPost } from '@f/definition/common/sharedPost';
import { SharedPostDialogParameter } from '@f/definition/components/sharedPostDialog/parameter';
import { SharedPostDialogResult } from '@f/definition/components/sharedPostDialog/result';
import { StringUtil } from '@c/util/stringUtil';
import { ArrayUtil } from '@c/util/arrayUtil';

export default Vue.extend({
  name: 'SharedPostCardList',
  props: {
    value: {
      type: Array as PropType<SharedPost[]>,
      default: () => [],
      required: true,
    },
    no1Divisions: {
      type: Array as PropType<SelectItem[]>,
      default: () => [
        {
          text: '',
          value: '',
        },
      ],
    },
    messageIfNoData: {
      type: String,
      default: '',
      required: false,
    },
  },
  computed: {
    isLogined(): boolean {
      return StringUtil.isNotEmpty(
        this.$accessor.firebaseAuthorization.userIdComputed,
      );
    },
    hasNoItem(): boolean {
      return ArrayUtil.isEmpty(this.value);
    },
  },
  methods: {
    /**
     * お気に入り追加処理
     */
    onAddedBookmark({ postId }: { postId: string }): void {
      if (this.isNotLogined()) {
        this.$accessor.snackBarError.open(
          'お気に入り追加するにはログインしてください。',
        );
        return;
      }

      const bookmarkedPostIndex = this.getTargetPostIndex(postId);
      if (bookmarkedPostIndex === -1) {
        return;
      }

      // お気に入り登録はサーバ処理結果を画面に反映する必要がないため、サーバ処理結果を待たない
      AjaxHelper.post(this.$axios, `/bookmarked-posts/${postId}`);
      const clonedPosts = this.$cloner.deepClone(this.value);
      clonedPosts[bookmarkedPostIndex].numberOfBookmarks++;
      clonedPosts[bookmarkedPostIndex].isBookmarkedByLoginUser = true;
      this.$emit('input', clonedPosts);
    },
    /**
     * お気に入り削除処理
     */
    // ログインしていない状態でお気に入り削除は画面上では考えられないため、ログインチェックを行っていない
    onRemovedBookmark({ postId }: { postId: string }): void {
      const bookmarkedPostIndex = this.getTargetPostIndex(postId);
      if (bookmarkedPostIndex === -1) {
        return;
      }

      // お気に入り削除はサーバ処理結果を画面に反映する必要がないため、サーバ処理結果を待たない
      AjaxHelper.delete(this.$axios, `/bookmarked-posts/${postId}`);
      const clonedPosts = this.$cloner.deepClone(this.value);
      clonedPosts[bookmarkedPostIndex].numberOfBookmarks--;
      clonedPosts[bookmarkedPostIndex].isBookmarkedByLoginUser = false;
      this.$emit('input', clonedPosts);
    },
    /**
     * 通報処理
     */
    async onConfirmedReport({ postId }: { postId: string }): Promise<void> {
      if (this.isNotLogined()) {
        this.$accessor.snackBarError.open(
          '投稿を通報するにはログインしてください。',
        );
        return;
      }

      const reportedPostIndex = this.getTargetPostIndex(postId);
      if (reportedPostIndex === -1) {
        return;
      }

      const reportDialog = this.$refs.reportDialog as InstanceType<
        typeof ReportDialog
      >;
      const isSuccessful = await reportDialog.open({
        postId,
      });
      if (!isSuccessful) {
        return;
      }

      const clonedPosts = this.$cloner.deepClone(this.value);
      clonedPosts.splice(reportedPostIndex, 1);
      this.$emit('input', clonedPosts);
    },
    /**
     * 投稿削除処理
     */
    async onDeleted({ postId }: { postId: string }): Promise<void> {
      if (this.isNotLogined()) {
        this.$accessor.snackBarError.open(
          '投稿を削除するにはログインしてください。',
        );
        return;
      }

      const confirmDialog = this.$refs.confirmDialog as InstanceType<
        typeof ConfirmDialog
      >;
      const isConfirmed = await confirmDialog.open(
        '投稿を削除します。よろしいですか。',
      );
      if (!isConfirmed) {
        return;
      }

      const deletedPostIndex = this.getTargetPostIndex(postId);
      if (deletedPostIndex === -1) {
        return;
      }

      await AjaxHelper.delete(this.$axios, `/shared-posts/${postId}`);
      this.$accessor.snackBarInfo.open('投稿を削除しました。');
      const clonedPosts = this.$cloner.deepClone(this.value);
      clonedPosts.splice(deletedPostIndex, 1);
      this.$emit('input', clonedPosts);
    },
    /**
     * 投稿編集時処理
     */
    async onEdited({ postId }: { postId: string }): Promise<void> {
      const editedPostIndex = this.getTargetPostIndex(postId);
      if (editedPostIndex === -1) {
        return;
      }

      const clonedPosts = this.$cloner.deepClone(this.value);
      const clonedEditedPost = clonedPosts[editedPostIndex];
      const parameter: SharedPostDialogParameter = {
        postId: clonedEditedPost.postId,
        companyNumber: clonedEditedPost.companyNumber,
        companyName: clonedEditedPost.companyName,
        companyHomepageUrl: clonedEditedPost.companyHomepageUrl,
        companyImageUrl: clonedEditedPost.companyImageUrl,
        remarks: clonedEditedPost.remarks,
        updatedAt: clonedEditedPost.updatedAt,
        postDetails: clonedEditedPost.postDetails.map((x) => ({
          postDetailId: x.postDetailId,
          no1Content: x.no1Content,
          no1Division: x.no1Division,
        })),
      };
      const result = await this.openSharedPostDialog(parameter);
      if (result === undefined) {
        return;
      }

      clonedEditedPost.postId = result.postId;
      clonedEditedPost.companyNumber = result.companyNumber;
      clonedEditedPost.companyName = result.companyName;
      clonedEditedPost.companyHomepageUrl = result.companyHomepageUrl;
      clonedEditedPost.companyImageUrl = result.companyImageUrl;
      clonedEditedPost.remarks = result.remarks;
      clonedEditedPost.updatedAt = result.updatedAt;
      clonedEditedPost.postDetails = result.postDetails.map((x) => ({
        postDetailId: x.postDetailId,
        no1Content: x.no1Content,
        no1Division: x.no1Division,
      }));
      clonedPosts[editedPostIndex] = clonedEditedPost;
      this.$emit('input', clonedPosts);
    },
    /**
     * 新規投稿追加ボタン押下処理
     */
    async onClickedAddPostButton(): Promise<void> {
      if (this.isNotLogined()) {
        this.$accessor.snackBarError.open('投稿するにはログインしてください。');
        return;
      }

      // No.1区分は選択肢の一番上を初期値とする
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
      // 新規に作成した投稿はお気に入り未追加であるため、お気に入りページでは新規投稿は画面に表示しない
      const currentPagePath = this.$nuxt.$route.path;
      const isBookmarkPage = currentPagePath === '/bookmark';
      if (result === undefined || isBookmarkPage) {
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
      const clonedPosts = this.$cloner.deepClone(this.value);
      clonedPosts.unshift(newPost);
      this.$emit('input', clonedPosts);
    },

    // #region private

    /**
     * 投稿編集ダイアログ起動
     */
    async openSharedPostDialog(
      parameter: SharedPostDialogParameter,
    ): Promise<SharedPostDialogResult | void> {
      const sharedPostDialog = this.$refs.sharedPostDialog as InstanceType<
        typeof SharedPostDialog
      >;

      const result = await sharedPostDialog.open(parameter);
      return result;
    },
    /**
     * 投稿IDから投稿要素番号を取得
     */
    getTargetPostIndex(keyPostId: string): number {
      return this.value.findIndex((x) => x.postId === keyPostId);
    },
    /**
     * ユーザがログイン済みであるか
     */
    isNotLogined(): boolean {
      const firebaseLoginUserId =
        this.$accessor.firebaseAuthorization.userIdComputed;
      return StringUtil.isEmpty(firebaseLoginUserId);
    },
    // #endregion
  },
});
</script>
