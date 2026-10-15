<template>
  <SnackBarBase v-model="isShown" :message="message" color="error" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SnackBarErrorData } from '@f/definition/components/snackBarError/data';
import { StringUtil } from '@c/util/stringUtil';

export default defineComponent({
  name: 'SnackBarError',
  data(): SnackBarErrorData {
    return {
      isShown: false,
      message: '',
    };
  },
  created() {
    const store = this.$accessor.snackBarError;
    // 同じ内容の通知でも開き直すため、状態ではなく通知の操作を監視する。監視はコンポーネントの破棄時に解除される
    store.$onAction(({ name, after }) => {
      if (name !== 'open') {
        return;
      }
      after(() => {
        const message = store.message;
        if (StringUtil.isEmpty(message)) {
          return;
        }

        this.message = message;
        this.isShown = true;
      });
    });
  },
  methods: {
    onClickedCloseButton(): void {
      this.isShown = false;
    },
  },
});
</script>
