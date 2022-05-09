<template>
  <SnackBarBase v-model="isShown" :message="message" color="primary" />
</template>

<script lang="ts">
import Vue from 'vue';
import { SnackBarInfoData } from '@f/definition/components/snackBarInfo/data';

export default Vue.extend({
  name: 'SnackBarInfo',
  data(): SnackBarInfoData {
    return {
      isShown: false,
      message: '',
    };
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackBarInfo/open') {
        this.message = state.snackBarInfo.message;
        this.isShown = true;
      }
    });
  },
  methods: {
    onClickedCloseButton(): void {
      this.isShown = false;
    },
  },
});
</script>

<style lang="sass" scoped>
.pre-wrap
  white-space: pre-wrap
</style>
