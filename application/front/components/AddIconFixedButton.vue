<template>
  <div
    class="add-post-button position-fixed bottom-0 right-0 mr-6 mb-16 pb-2 pb-md-0"
  >
    <v-btn
      icon
      size="large"
      elevation="6"
      color="primary"
      aria-label="新規投稿"
      @click="onClickedAddButton"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AddIconFixedButton',
  emits: ['click'],
  methods: {
    onClickedAddButton(): void {
      this.$emit('click');
    },
  },
});
</script>

<style scoped>
.add-post-button {
  z-index: 100;
}
</style>
