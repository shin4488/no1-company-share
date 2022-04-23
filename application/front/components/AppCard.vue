<template>
  <v-card>
    <!-- 会社名・oooで一位 -->
    <v-card-title>
      <v-btn text :href="companyHomepageUrl">{{ companyName }} </v-btn>
    </v-card-title>
    <v-card-text class="text-h5 font-weight-bold">
      <div v-for="(detailText, index) in postDetailsComputed" :key="index">
        {{ detailText }}
      </div>
    </v-card-text>

    <!-- 会社画像 -->

    <!-- 会社詳細・投稿説明詳細 -->

    <!-- 投稿者情報 -->
    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { SelectItem } from '@f/definition/common/selectItem';
import { AppCardPostDetail } from '@f/definition/components/appCard/data';

export default Vue.extend({
  name: 'AppCard',
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
      type: Array as PropType<AppCardPostDetail[]>,
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
    },
  },
  computed: {
    postDetailsComputed(): string[] {
      return this.postDetails.map(
        (x) => `${x.no1Content}で${this.getNo1Division(x.no1Division)}`,
      );
    },
  },
  mounted() {
    console.log('AppCard');
    console.log(this.value);
    console.log(this.companyNumber);
    console.log(this.companyName);
    console.log(this.companyHomepageUrl);
    console.log(this.postingUserId);
    console.log(this.postingUserName);
    console.log(this.postingUserIcomImageUrl);
    console.log(this.numberOfBookmarks);
    console.log(this.remarks);
    console.log(this.postDetails);
    console.log(this.no1Divisions);
  },
  methods: {
    getNo1Division(divisionValue: string): string {
      const targetDivision = this.no1Divisions.find(
        (x) => x.value === divisionValue,
      );
      return targetDivision?.text || '';
    },
    onClickedBookmarkButton(): void {
      this.$emit('click-bookmark', {
        postId: this.value,
        postingUserId: this.postingUserId,
      });
    },
  },
});
</script>
