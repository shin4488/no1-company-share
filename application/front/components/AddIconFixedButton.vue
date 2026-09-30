<template>
  <v-btn
    icon
    size="large"
    elevation="6"
    color="primary"
    class="add-post-button"
    aria-label="新規投稿"
    :class="additionButtonClassComputed"
    @click="onClickedAddButton"
  >
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AddIconFixedButton',
  emits: ['click'],
  computed: {
    additionButtonClassComputed(): string {
      return this.$vuetify.display.smAndDown
        ? 'add-post-button--mobile'
        : 'mb-10';
    },
  },
  methods: {
    onClickedAddButton(): void {
      this.$emit('click');
    },
  },
});
</script>

<style scoped>
.add-post-button {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 100;
}

.add-post-button--mobile {
  position: static;
  display: flex;
  margin: 0 0 16px auto;
}
</style>
