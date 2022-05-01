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
import Vue from 'vue';
import { ConfirmDialogData } from '@f/definition/components/confirmDialog/data';

export default Vue.extend({
  name: 'ConfirmDialog',
  data(): ConfirmDialogData {
    return {
      isDialogShow: false,
      contentText: '',
    };
  },
  methods: {
    open(contentText: string): Promise<boolean> {
      this.isDialogShow = true;
      this.contentText = contentText;

      return new Promise((resolve) => {
        this.$on('click-yes', () => {
          this.isDialogShow = false;
          resolve(true);
        });
        this.$on('click-no', () => {
          this.isDialogShow = false;
          resolve(false);
        });
      });
    },
    onClickedYesButton(): void {
      this.$emit('click-yes');
    },
    onClickedNoButton(): void {
      this.$emit('click-no');
    },
  },
});
</script>
