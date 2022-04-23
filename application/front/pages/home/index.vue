<template>
  <AppCardList
    v-model="sharedCompanyPosts"
    :no1-divisions="no1Divisions"
  ></AppCardList>
</template>

<script lang="ts">
import Vue from 'vue';
import { Context } from '@nuxt/types';
import { HomePageData } from '@f/definition/pages/home/data';

export default Vue.extend({
  name: 'HomePage',
  asyncData(_context: Context) {
    // const response = await $axios.post('', {});
    // const responseBody = response.data;
    const sharedCompanyPosts = [
      {
        postId: 'testpost1',
        companyNumber: 'testcompany1',
        companyName: 'テスト株式会社1',
        companyHomepageUrl:
          'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
        postingUserId: 'testuser1',
        postingUserName: '山田太郎',
        postingUserIcomImageUrl:
          'https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg',
        numberOfBookmarks: 10,
        remarks: '2020年度3月期友好証券報告書',
        postDetails: [
          {
            postDetailId: 1,
            no1Content: '何かを作ること',
            no1Division: '1',
          },
        ],
      },
      {
        postId: 'testpost2',
        companyNumber: 'testcompany2',
        companyName: 'テスト株式会社2',
        companyHomepageUrl:
          'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
        postingUserId: 'testuser1',
        postingUserName: '山田太郎',
        postingUserIcomImageUrl:
          'https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg',
        numberOfBookmarks: 10,
        remarks: '2020年度3月期友好証券報告書',
        postDetails: [
          {
            postDetailId: 1,
            no1Content: 'テストテストテスト',
            no1Division: '1',
          },
          {
            postDetailId: 2,
            no1Content: 'テストテストテスト',
            no1Division: '2',
          },
        ],
      },
    ];

    const no1Divisions = [
      {
        text: '世界一',
        value: '1',
      },
      {
        text: '日本一',
        value: '2',
      },
      {
        text: '福井一',
        value: '3',
      },
    ];

    return {
      sharedCompanyPosts,
      no1Divisions,
    };
  },
  data(): HomePageData {
    return {
      sharedCompanyPosts: [],
      no1Divisions: [],
    };
  },
  mounted() {
    console.log('home');
    console.log(this.sharedCompanyPosts);
    console.log(this.no1Divisions);
  },
});
</script>
