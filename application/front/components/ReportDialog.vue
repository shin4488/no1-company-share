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
            <v-textarea v-model="reportDetail" rows="3" auto-grow>
              <template #label>
                <span class="required"><strong>* </strong></span
                >通報理由</template
              >
            </v-textarea>
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
import { ReportDialogParameter } from '@f/definition/components/reportDialog/parameter';
import { StringUtil } from '@c/util/stringUtil';
import { ReportPostRequest } from '@f/definition/components/reportDialog/apiSpec/reportPostRequest';
import { AjaxHelper } from '@f/common/ajax/ajaxHelper';

export default Vue.extend({
  name: 'ConfirmDialog',
  data(): ReportDialogData {
    return {
      isDialogShow: false,
      postId: '',
      reportDetail: '',
    };
  },
  computed: {
    haNotReportContentComputed(): boolean {
      return StringUtil.isEmpty(this.reportDetail);
    },
  },
  methods: {
    open(parameter: ReportDialogParameter): Promise<boolean> {
      this.isDialogShow = true;
      this.postId = parameter.postId;
      this.reportDetail = '';

      return new Promise((resolve) => {
        this.$on('success', () => {
          this.isDialogShow = false;
          resolve(true);
        });
        this.$on('cancel', () => {
          this.isDialogShow = false;
          resolve(false);
        });
      });
    },
    async onClickedConfirmButton(): Promise<void> {
      const reportRequest: ReportPostRequest = {
        posts: [
          {
            id: this.postId,
            reportDetail: this.reportDetail,
          },
        ],
      };
      // APIレスポンスエラー検知のためにいったんエラーメッセージを空にしている
      this.$accessor.snackBarError.open('');
      await this.$accessor.spinnerOverlay.open(async () => {
        await AjaxHelper.post(
          this.$axios,
          '/reported-shared-posts/',
          reportRequest,
        );
      });
      // TODO:エラー判定の改善（エラースナックバーにメッセージがある=エラーであるとしている）
      if (StringUtil.isEmpty(this.$accessor.snackBarError.message)) {
        this.$accessor.snackBarInfo.open('投稿を通報しました。');
        this.$emit('success');
      }
    },
    onClickedCancelButton(): void {
      this.$emit('cancel');
    },
  },
});
</script>

<style lang="sass" scoped>
.required
  color: red
</style>
