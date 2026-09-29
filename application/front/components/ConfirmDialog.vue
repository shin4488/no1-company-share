<template>
  <v-dialog v-model="isDialogShow" max-width="70%" width="auto" persistent>
    <v-card>
      <v-card-title dense>
        {{ contentText }}
      </v-card-title>

      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="onClickedYesButton">はい</v-btn>
        <v-btn @click="onClickedNoButton">いいえ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ConfirmDialog',
  data() {
    return {
      isDialogShow: false,
      contentText: '',
      resolveDialog: null as ((confirmed: boolean) => void) | null,
    };
  },
  methods: {
    open(contentText: string): Promise<boolean> {
      this.isDialogShow = true;
      this.contentText = contentText;

      return new Promise<boolean>((resolve) => {
        this.resolveDialog = resolve;
      });
    },
    close(confirmed: boolean): void {
      this.isDialogShow = false;
      const resolve = this.resolveDialog;
      this.resolveDialog = null;
      resolve?.(confirmed);
    },
    onClickedYesButton(): void {
      this.close(true);
    },
    onClickedNoButton(): void {
      this.close(false);
    },
  },
});
</script>
