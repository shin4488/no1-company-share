<template>
  <v-row>
    <v-col
      v-for="(item, index) in value"
      :key="index"
      xl="3"
      md="4"
      sm="6"
      xs="12"
    >
      <AppCard
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
      ></AppCard>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { SelectItem } from '@f/definition/common/selectItem';
import { SharedPost } from '@f/definition/common/sharedPost';

export default Vue.extend({
  name: 'AppCardList',
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
  },
  methods: {
    onAddedBookmark(context: { postId: string }): void {
      this.$emit('add-bookmark', context);
    },
    onRemovedBookmark(context: { postId: string }): void {
      this.$emit('remove-bookmark', context);
    },
    onConfirmedReport(context: { postId: string }): void {
      this.$emit('confirm-report', context);
    },
    onEdited(context: { postId: string }): void {
      this.$emit('click-edit', context);
    },
    onDeleted(context: { postId: string }): void {
      this.$emit('confirm-delete', context);
    },
  },
});
</script>
