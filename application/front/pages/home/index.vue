<template>
  <div>
    <SharedPostCardList
      v-model="sharedPosts"
      message-if-no-data="まだ投稿がありません。最初の投稿をしてみよう！"
      :no1-divisions="no1Divisions"
    />
    <LoadMoreButton
      v-if="isLoadMoreButtonShown"
      text="さらに表示"
      @click="onClickedLoadMoreButton"
    />
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#app';
import { usePostList } from '@f/composables/usePostList';

useHead({ title: 'ホーム' });
const {
  sharedPosts,
  no1Divisions,
  isLoadMoreButtonShown,
  onClickedLoadMoreButton,
} = await usePostList('home');
</script>
