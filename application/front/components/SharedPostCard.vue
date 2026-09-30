<template>
  <v-card>
    <!-- Vue側でエスケープ処理を行ってくれるため、onerrorやscriptタグなどの入力値処理は行っていない -->
    <!-- https://jp.vuejs.org/v2/guide/security.html#HTML-%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84 -->
    <!-- 会社名 -->
    <v-card-title>
      <a
        v-if="hasCompanyUrl"
        class="wrapped-button"
        text
        :href="companyHomepageUrl"
        target="_blank"
        v-text="companyName"
      />
      <a v-else class="auto-cursor wrapped-button" text v-text="companyName" />
    </v-card-title>

    <!-- 一位内容 -->
    <v-card-text class="shared-post-text-max overflow-y-auto">
      <div
        v-for="(detailText, index) in postDetailsComputed"
        :key="index"
        class="font-weight-bold"
        v-text="detailText"
      />

      <!-- 会社画像 -->
      <v-img
        v-show="hasCompanyImageUrl"
        contain
        height="100"
        :src="companyImageUrl"
      />

      <!-- 備考（投稿説明） -->
      <div class="text--primary pre-wrap" v-text="remarks" />
    </v-card-text>

    <v-divider />

    <!-- 投稿者情報 -->
    <v-card-actions class="post-card-actions">
      <v-avatar size="40">
        <v-img
          class="elevation-6"
          :title="postingUserName"
          :alt="postingUserName"
          :src="postingUserIcomImageUrl"
        />
      </v-avatar>

      <span class="post-card-actions__name" :title="postingUserName">
        {{ postingUserName }}
      </span>

      <div class="post-card-actions__controls">
        <span class="post-card-actions__bookmark">
          <v-icon
            dense
            color="bookmark"
            :aria-label="
              isBookmarkedByLoginUser ? 'お気に入りを解除' : 'お気に入りに追加'
            "
            @click="onClickedBookmarkButton"
            @keydown.enter.prevent="onClickedBookmarkButton"
            @keydown.space.prevent="onClickedBookmarkButton"
          >
            {{ isBookmarkedByLoginUser ? 'mdi-heart' : 'mdi-heart-outline' }}
          </v-icon>
          <span class="subheading" v-text="numberOfBookmarksComputed" />
        </span>

        <v-icon
          v-show="isLogined && !isPostedByLoginUser"
          dense
          color="warning"
          aria-label="投稿を通報"
          @click="onClickedAlertButton"
          @keydown.enter.prevent="onClickedAlertButton"
          @keydown.space.prevent="onClickedAlertButton"
        >
          mdi-alert-outline
        </v-icon>
        <v-icon
          v-show="isLogined && isPostedByLoginUser"
          dense
          color="secondary"
          aria-label="投稿を編集"
          @click="onClickedEditButton"
          @keydown.enter.prevent="onClickedEditButton"
          @keydown.space.prevent="onClickedEditButton"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          v-show="isLogined && isPostedByLoginUser"
          dense
          color="secondary"
          aria-label="投稿を削除"
          @click="onClickedDeleteButton"
          @keydown.enter.prevent="onClickedDeleteButton"
          @keydown.space.prevent="onClickedDeleteButton"
        >
          mdi-delete
        </v-icon>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { SelectItem } from '@f/definition/common/selectItem';
import { PostDetail } from '@f/definition/common/sharedPost';
import { StringUtil } from '@c/util/stringUtil';

export default defineComponent({
  name: 'SharedPostCard',
  props: {
    // postId
    postId: {
      type: String,
      default: '',
      required: true,
    },
    companyNumber: {
      type: String,
      default: '',
      required: true,
    },
    companyName: {
      type: String,
      default: '',
      required: false,
    },
    companyHomepageUrl: {
      type: String,
      default: '',
      required: false,
    },
    companyImageUrl: {
      type: String,
      default: '',
      required: false,
    },
    postingUserId: {
      type: String,
      default: '',
      required: true,
    },
    postingUserName: {
      type: String,
      default: '',
      required: false,
    },
    postingUserIcomImageUrl: {
      type: String,
      default: '',
      required: false,
    },
    isBookmarkedByLoginUser: {
      type: Boolean,
      default: false,
      required: false,
    },
    numberOfBookmarks: {
      type: Number,
      default: 0,
      required: false,
    },
    remarks: {
      type: String,
      default: '',
      required: false,
    },
    postDetails: {
      type: Array as PropType<PostDetail[]>,
      default: () => [
        {
          postDetailId: 1,
          no1Content: '',
          no1Division: '1',
        },
      ],
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
      required: true,
    },
  },
  computed: {
    isLogined(): boolean {
      return StringUtil.isNotEmpty(
        this.$accessor.firebaseAuthorization.userIdComputed,
      );
    },
    hasCompanyUrl(): boolean {
      return StringUtil.isNotEmpty(this.companyHomepageUrl);
    },
    hasCompanyImageUrl(): boolean {
      return StringUtil.isNotEmpty(this.companyImageUrl);
    },
    postDetailsComputed(): string[] {
      return this.postDetails.map(
        (x) => `${x.no1Content} : ${this.getNo1Division(x.no1Division)}`,
      );
    },
    isPostedByLoginUser(): boolean {
      return (
        this.postingUserId ===
        this.$accessor.firebaseAuthorization.userIdComputed
      );
    },
    numberOfBookmarksComputed(): string {
      const dividingNumber = 1000;
      if (this.numberOfBookmarks < dividingNumber) {
        return StringUtil.toString(this.numberOfBookmarks);
      }

      // 1000以上は「K」表示とする
      const devidedValue = this.numberOfBookmarks / dividingNumber;
      const flooredValue = Math.floor(devidedValue / 0.1) * 0.1;
      return `${flooredValue}K`;
    },
  },
  methods: {
    getNo1Division(divisionValue: string): string {
      const targetDivision = this.no1Divisions.find(
        (x) => x.value === divisionValue,
      );
      return targetDivision?.text || '';
    },
    onClickedBookmarkButton(): void {
      // 「今お気に入り状態でお気に入りクリック」=「お気に入り解除」とみなす
      if (this.isBookmarkedByLoginUser) {
        this.$emit('remove-bookmark', {
          postId: this.postId,
        });
      } else {
        this.$emit('add-bookmark', {
          postId: this.postId,
        });
      }
    },
    onClickedAlertButton(): void {
      this.$emit('confirm-report', {
        postId: this.postId,
      });
    },
    onClickedEditButton(): void {
      this.$emit('click-edit', {
        postId: this.postId,
      });
    },
    onClickedDeleteButton(): void {
      this.$emit('confirm-delete', {
        postId: this.postId,
      });
    },
  },
});
</script>

<style lang="sass" scoped>
.wrapped-button
  text-decoration: none
.pre-wrap
  white-space: pre-wrap
.auto-cursor
  cursor: auto
.post-card-actions
  gap: 12px
  min-width: 0
  &__name
    flex: 1 1 auto
    min-width: 0
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
  &__controls
    display: flex
    align-items: center
    flex: 0 0 auto
    gap: 12px
  &__bookmark
    display: inline-flex
    align-items: center
    gap: 4px
    white-space: nowrap
.shared-post-text-max
  max-height: 250px

::-webkit-scrollbar
    width: 5px
::-webkit-scrollbar-thumb
    border-radius: 20px
    background-color: lightgray
</style>
