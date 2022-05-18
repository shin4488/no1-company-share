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
    <v-card-actions>
      <v-list-item dense class="grow full-width">
        <v-list-item-avatar>
          <v-img
            class="elevation-6"
            :title="postingUserName"
            :alt="postingUserName"
            :src="postingUserIcomImageUrl"
          />
        </v-list-item-avatar>

        <v-list-item-content :title="postingUserName">
          <v-list-item-title>
            {{ postingUserName }}
          </v-list-item-title>
        </v-list-item-content>

        <v-row align="center" justify="end">
          <v-icon dense color="bookmark" @click="onClickedBookmarkButton">
            {{ isBookmarkedByLoginUser ? 'mdi-heart' : 'mdi-heart-outline' }}
          </v-icon>
          <span class="subheading mr-2" v-text="numberOfBookmarksComputed" />

          <v-icon
            v-show="isLogined && !isPostedByLoginUser"
            dense
            color="warning"
            @click="onClickedAlertButton"
          >
            mdi-alert-outline
          </v-icon>
          <v-icon
            v-show="isLogined && isPostedByLoginUser"
            class="mr-2"
            dense
            color="secondary"
            @click="onClickedEditButton"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            v-show="isLogined && isPostedByLoginUser"
            dense
            color="secondary"
            @click="onClickedDeleteButton"
          >
            mdi-delete
          </v-icon>
        </v-row>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { SelectItem } from '@f/definition/common/selectItem';
import { PostDetail } from '@f/definition/common/sharedPost';
import { StringUtil } from '@c/util/stringUtil';

export default Vue.extend({
  name: 'SharedPostCard',
  props: {
    // postId
    value: {
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
          postId: this.value,
        });
      } else {
        this.$emit('add-bookmark', {
          postId: this.value,
        });
      }
    },
    onClickedAlertButton(): void {
      this.$emit('confirm-report', {
        postId: this.value,
      });
    },
    onClickedEditButton(): void {
      this.$emit('click-edit', {
        postId: this.value,
      });
    },
    onClickedDeleteButton(): void {
      this.$emit('confirm-delete', {
        postId: this.value,
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
.full-width
  width: 100%
.shared-post-text-max
  max-height: 250px

::-webkit-scrollbar
    width: 5px
::-webkit-scrollbar-thumb
    border-radius: 20px
    background-color: lightgray
</style>
