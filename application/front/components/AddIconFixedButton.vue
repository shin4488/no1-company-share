<template>
  <v-btn
    icon
    size="large"
    elevation="6"
    color="primary"
    class="add-post-button"
    :position="$vuetify.display.smAndDown ? 'absolute' : 'fixed'"
    :location="$vuetify.display.smAndDown ? 'top right' : 'bottom right'"
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
      return this.$vuetify.display.smAndDown ? 'ma-0' : 'mr-6 mb-16';
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
  z-index: 100;
}
</style>
