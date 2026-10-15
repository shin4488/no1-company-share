<template>
  <!-- モーダルダイアログよりも上に表示できるようにz-indexを大きめに設定 -->
  <v-overlay
    :z-index="10000"
    :model-value="isShown"
    class="align-center justify-center"
  >
    <Spinner show />
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SpinnerOverlay',
  computed: {
    isShown(): boolean {
      return this.$accessor.spinnerOverlay.isShown;
    },
  },
});
</script>
