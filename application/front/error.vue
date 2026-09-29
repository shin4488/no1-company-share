<template>
  <main class="error-page">
    <h1>{{ message }}</h1>
    <NuxtLink to="/home">ホームへ戻る</NuxtLink>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHead } from '#app';

const props = defineProps<{ error: { statusCode: number } }>();
const message = computed(() =>
  props.error.statusCode === 404
    ? '404 指定したページが見つかりません。'
    : 'エラーが発生しました。',
);
useHead({ title: message });
</script>

<style scoped>
.error-page {
  padding: 2rem;
}
</style>
