<template>
  <SnackBarBase v-model="isShown" :message="message" color="primary" />
</template>

<script lang="ts">
import Vue from 'vue';
import { SnackBarInfoData } from '@f/definition/components/snackBarInfo/data';
import { StringUtil } from '@c/util/stringUtil';

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
        const message = state.snackBarInfo.message;
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
