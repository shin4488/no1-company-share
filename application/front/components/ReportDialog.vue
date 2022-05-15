<template>
  <v-dialog v-model="isDialogShow" max-width="70%" persistent>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col class="mt-3">
            <div>通報した投稿は全ユーザに対して表示されなくなります。</div>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col>
            <v-textarea
              v-model="reportDetail"
              label="通報理由"
              rows="3"
              auto-grow
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          color="primary"
          :disabled="haNotReportContentComputed"
          @click="onClickedConfirmButton"
          >通報</v-btn
        >
        <v-btn @click="onClickedCancelButton">キャンセル</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { ReportDialogData } from '@f/definition/components/reportDialog/data';
import { ReportDialogResult } from '@f/definition/components/reportDialog/result';
import { StringUtil } from '@c/util/stringUtil';

export default Vue.extend({
  name: 'ConfirmDialog',
  data(): ReportDialogData {
    return {
      isDialogShow: false,
      reportDetail: '',
    };
  },
  computed: {
    haNotReportContentComputed(): boolean {
      return StringUtil.isEmpty(this.reportDetail);
    },
  },
  methods: {
    open(): Promise<ReportDialogResult | void> {
      this.isDialogShow = true;
      this.reportDetail = '';

      return new Promise((resolve) => {
        this.$on('confirm', (result: ReportDialogResult) => {
          this.isDialogShow = false;
          resolve(result);
        });
        this.$on('cancel', () => {
          this.isDialogShow = false;
          resolve();
        });
      });
    },
    onClickedConfirmButton(): void {
      const result: ReportDialogResult = {
        reportDetail: this.reportDetail,
      };
      this.$emit('confirm', result);
    },
    onClickedCancelButton(): void {
      this.$emit('cancel');
    },
  },
});
</script>
