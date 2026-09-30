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
import { definePageMeta } from '#imports';
import { usePostList } from '@f/composables/usePostList';

// 認証操作はglobal middlewareが処理する。リンク解決時にもURLを既知の経路にする。
definePageMeta({ alias: ['/login', '/logout'] });
useHead({ title: 'ホーム' });
const {
  sharedPosts,
  no1Divisions,
  isLoadMoreButtonShown,
  onClickedLoadMoreButton,
} = await usePostList('home');
</script>
