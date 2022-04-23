<template>
  <v-row>
    <v-col v-for="(item, index) in value" :key="index" cols="4" xs="12">
      <AppCard
        v-model="item.postId"
        :company-number="item.companyNumber"
        :company-name="item.companyName"
        :company-homepage-url="item.companyHomepageUrl"
        :posting-user-id="item.postingUserId"
        :posting-user-name="item.postingUserName"
        :posting-user-icom-image-url="item.postingUserIcomImageUrl"
        :number-of-bookmarks="item.numberOfBookmarks"
        :remarks="item.remarks"
        :post-details="item.postDetails"
        :no1-divisions="no1Divisions"
        @click-bookmark="onClikedBookmarkButton"
      ></AppCard>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { SelectItem } from '@f/definition/common/selectItem';
import { AppCardItem } from '@f/definition/components/appCardList/prop';

export default Vue.extend({
  name: 'AppCardList',
  props: {
    value: {
      type: Array as PropType<AppCardItem[]>,
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
  mounted() {
    console.log('AppCardList');
    console.log(this.value);
    console.log(this.no1Divisions);
  },
  methods: {
    onClikedBookmarkButton(args) {
      console.log(args);
    },
  },
});
</script>
