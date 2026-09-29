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
import { SpinnerOverlayData } from '@f/definition/components/spinnerOverlay/data';

export default defineComponent({
  name: 'SpinnerOverlay',
  data(): SpinnerOverlayData {
    return {
      isShown: false,
    };
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'spinnerOverlay/change') {
        this.isShown = state.spinnerOverlay.isShown;
      }
    });
  },
});
</script>
