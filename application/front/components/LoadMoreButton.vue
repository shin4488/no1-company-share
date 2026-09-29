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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadMoreButton',
  props: {
    text: {
      type: String,
      default: 'さらに表示',
      required: false,
    },
  },
  emits: ['click'],
  methods: {
    onClickedLoadMoreButton(): void {
      this.$emit('click');
    },
  },
});
</script>
