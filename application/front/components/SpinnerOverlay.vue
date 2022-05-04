<template>
  <!-- モーダルダイアログよりも上に表示できるようにz-indexを大きめに設定 -->
  <v-overlay z-index="10000" :value="isShown">
    <Spinner show />
  </v-overlay>
</template>

<script lang="ts">
import Vue from 'vue';
import { SpinnerOverlayData } from '@f/definition/components/spinnerOverlay/data';

export default Vue.extend({
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
