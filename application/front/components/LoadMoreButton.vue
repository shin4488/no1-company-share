<template>
  <div class="d-flex justify-center mt-6">
    <v-btn
      color="primary"
      elevation="7"
      rounded
      @click="onClickedLoadMoreButton"
      >{{ text }}</v-btn
    >
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'LoadMoreButton',
  props: {
    text: {
      type: String,
      default: 'さらに表示',
      required: false,
    },
  },
  methods: {
    onClickedLoadMoreButton(): void {
      this.$emit('click');
    },
  },
});
</script>
