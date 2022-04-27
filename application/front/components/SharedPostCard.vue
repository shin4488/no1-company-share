<template>
  <v-card>
    <!-- TODO:hrefにスクリプトインジェクションされた時の対応必要？ -->
    <!-- 会社名 -->
    <v-card-title>
      <a
        color="secondary"
        class="wrapped-button"
        text
        :href="companyHomepageUrl"
        target="_blank"
      >
        {{ companyName }}
      </a>
    </v-card-title>

    <!-- 一位内容 -->
    <v-card-text>
      <div
        v-for="(detailText, index) in postDetailsComputed"
        :key="index"
        class="font-weight-bold"
      >
        {{ detailText }}
      </div>

      <!-- TODO:srcにスクリプトインジェクションされた時の対応必要？ -->
      <!-- 会社画像 -->
      <v-img
        v-show="hasCompanyImageUrl"
        contain
        height="100"
        :src="companyImageUrl"
      >
      </v-img>

      <!-- 備考（投稿説明） -->
      <div class="text--primary">
        {{ remarks }}
      </div>
    </v-card-text>

    <v-divider></v-divider>

    <!-- 投稿者情報 -->
    <v-card-actions>
      <v-list-item dense class="grow">
        <v-list-item-avatar>
          <v-img
            class="elevation-6"
            :alt="postingUserName"
            :src="postingUserIcomImageUrl"
          ></v-img>
        </v-list-item-avatar>

        <!-- <div style="white-space: normal"> -->
        <!-- TODO:投稿者名が長い時の折り返し -->
        <v-list-item-content>
          <v-list-item-title>
            {{ postingUserName }}
          </v-list-item-title>
        </v-list-item-content>

        <v-row align="center" justify="end">
          <v-icon dense color="bookmark" @click="onClickedBookmarkButton">
            {{ isBookmarkedByLoginUser ? 'mdi-heart' : 'mdi-heart-outline' }}
          </v-icon>
          <span class="subheading mr-2">{{ numberOfBookmarks }}</span>

          <v-icon
            v-show="!isPostedByLoginUser"
            dense
            color="warning"
            @click="onClickedAlertButton"
          >
            mdi-alert-outline
          </v-icon>
          <v-icon
            v-show="isPostedByLoginUser"
            class="mr-2"
            dense
            color="secondary"
            @click="onClickedEditButton"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            v-show="isPostedByLoginUser"
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
      // TODO:報告してよいかの確認ダイアログ起動
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
      // TODO:削除してよいかの確認ダイアログ起動
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
</style>
