<template>
  <v-app dark>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/"> ホームへ戻る</NuxtLink>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { ErrorData } from '@f/definition/layouts/error/data';
import { PageHeadData } from '@f/definition/pages/common/headData';

export default Vue.extend({
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data(): ErrorData {
    return {
      pageNotFound: '404 指定したページが見つかりません。',
      otherError: 'エラーが発生しました。',
    };
  },
  head(): PageHeadData {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
});
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
