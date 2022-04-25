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
import { SharedPost } from '@f/definition/common/sharedPost';

export default Vue.extend({
  name: 'HomePage',
  async asyncData({ $axios }: Context) {
    try {
      const response = await $axios.get('/localhost/shared-posts', {
        params: {
          limit: 30,
          offset: 61,
          baseDateTime: '2022-04-31', // '2022-04-31 10:30:59.999',
          isMyPostOnly: false,
        },
      });
      const responseBody = response.data;
      console.log(responseBody);
    } catch (error) {
      console.log(error);
    }

    const sharedCompanyPosts: SharedPost[] = [
      {
        postId: 'testpost1',
        companyNumber: 'testcompany1',
        companyName: 'テスト株式会社1',
        companyHomepageUrl:
          'https://ja.wikipedia.org/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8',
        companyImageUrl:
          'ttps://upload.wikimedia.org/wikipedia/commons/f/ff/Wikipedia_logo_593.jpg',
        postingUserId: '0yC8iU1797VrDALJsG4siIU6C382',
        postingUserName: 'S. U.',
        postingUserIcomImageUrl:
          'https://lh3.googleusercontent.com/a/AATXAJyZSD8UjGl1eF9s-OtXTO6uECzHcMZ0y5HtO1Ei=s96-c',
        isBookmarkedByLoginUser: false,
        numberOfBookmarks: 10,
        remarks: '2020年度3月期有価証券報告書',
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
        companyName: 'qwertyuiop asdfghjkl zxcvbnm qwertyuiop',
        companyHomepageUrl: 'http://example.com/',
        companyImageUrl: 'https://cdn.vuetifyjs.com/images/cards/sunshine.jpg',
        postingUserId: 'testuser1',
        postingUserName: 'abcdefghijklmn opqrstu vvvvvvv',
        postingUserIcomImageUrl:
          'https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg',
        isBookmarkedByLoginUser: true,
        numberOfBookmarks: 10,
        remarks:
          '2020年度3月期有価証券報告書テストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテスト',
        postDetails: [
          {
            postDetailId: 1,
            no1Content:
              'テストテストテストテストテストテストテストテストテストテストテストテスト',
            no1Division: '1',
          },
          {
            postDetailId: 2,
            no1Content: 'テストテストテスト',
            no1Division: '2',
          },
        ],
      },
      {
        postId: 'testpost3',
        companyNumber: 'testcompany3',
        companyName: 'テスト株式会社テスト株式会社テスト株式会社3',
        companyHomepageUrl: 'aaa',
        companyImageUrl: '',
        postingUserId: 'testuser1',
        postingUserName: '山田太郎',
        postingUserIcomImageUrl:
          'https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg',
        isBookmarkedByLoginUser: false,
        numberOfBookmarks: 0,
        remarks: '',
        postDetails: [
          {
            postDetailId: 1,
            no1Content: 'テストテストテスト',
            no1Division: '1',
          },
        ],
      },
      {
        postId: 'testpost4',
        companyNumber: 'testcompany4',
        companyName: 'テスト株式会社4',
        companyHomepageUrl:
          'https://ja.wikipedia.org/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8',
        companyImageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/f/ff/Wikipedia_logo_593.jpg',
        postingUserId: '0yC8iU1797VrDALJsG4siIU6C382',
        postingUserName: 'abcdefghijklmn opqrstu vvvvvvv',
        postingUserIcomImageUrl:
          'https://lh3.googleusercontent.com/a/AATXAJyZSD8UjGl1eF9s-OtXTO6uECzHcMZ0y5HtO1Ei=s96-c',
        isBookmarkedByLoginUser: true,
        numberOfBookmarks: 100000,
        remarks: '2020年度3月期有価証券報告書',
        postDetails: [
          {
            postDetailId: 1,
            no1Content: 'qwertyuiop asdfghjkl zxcvbnm qwertyuiop',
            no1Division: '1',
          },
        ],
      },
    ];

    const no1Divisions: SelectItem[] = [
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
