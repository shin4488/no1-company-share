<template>
  <v-overlay :value="isShown">
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
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
