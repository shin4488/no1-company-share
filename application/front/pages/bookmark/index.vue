<template>
  <div>
    <SharedPostCardList
      v-model="sharedPosts"
      message-if-no-data="まだお気に入りした投稿がありません。お気に入りを追加してみよう！"
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

useHead({ title: 'お気に入り' });
const {
  sharedPosts,
  no1Divisions,
  isLoadMoreButtonShown,
  onClickedLoadMoreButton,
} = await usePostList('bookmark');
</script>
