<template>
  <SnackBarBase v-model="isShown" :message="message" color="error" />
</template>

<script lang="ts">
import Vue from 'vue';
import { SnackBarErrorData } from '@f/definition/components/snackBarError/data';
import { StringUtil } from '@c/util/stringUtil';

export default Vue.extend({
  name: 'SnackBarError',
  data(): SnackBarErrorData {
    return {
      isShown: false,
      message: '',
    };
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackBarError/open') {
        const message = state.snackBarError.message;
        if (StringUtil.isEmpty(message)) {
          return;
        }

        this.message = message;
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
