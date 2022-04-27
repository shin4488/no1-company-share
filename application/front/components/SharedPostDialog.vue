<template>
  <v-dialog v-model="isOpenDialog" persistent>
    <v-btn @click="onClickedConfirmButton">確定</v-btn>
    <v-btn @click="onClickedCloseButton">閉じる</v-btn>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { SelectItem } from '@f/definition/common/selectItem';
import { SharedPostDialog } from '@f/definition/components/sharedPostDialog/data';
import { SharedPostDialogParameter } from '@f/definition/components/sharedPostDialog/parameter';
import { SharedPostDialogResult } from '@f/definition/components/sharedPostDialog/result';

export default Vue.extend({
  name: 'SharedPostCard',
  props: {
    no1Divisions: {
      type: Array as PropType<SelectItem[]>,
      default: () => [
        {
          text: '',
          value: '',
        },
      ],
      required: true,
    },
  },
  data(): SharedPostDialog {
    return {
      isOpenDialog: false,
      postId: '',
      companyNumber: '',
      companyName: '',
      companyHomepageUrl: '',
      companyImageUrl: '',
      remarks: '',
      updatedAt: '',
      postDetails: [
        {
          postDetailId: 0,
          no1Content: '',
          no1Division: '',
        },
      ],
    };
  },
  methods: {
    open(
      parameter: SharedPostDialogParameter,
    ): Promise<SharedPostDialogResult | void> {
      this.isOpenDialog = true;

      this.postId = parameter.postId;
      this.companyNumber = parameter.companyNumber;
      this.companyName = parameter.companyName;
      this.companyHomepageUrl = parameter.companyHomepageUrl;
      this.companyImageUrl = parameter.companyImageUrl;
      this.remarks = parameter.remarks;
      this.updatedAt = parameter.updatedAt;
      this.postDetails = parameter.postDetails.map((x) => ({
        postDetailId: x.postDetailId,
        no1Content: x.no1Content,
        no1Division: x.no1Division,
      }));

      return new Promise((resolve) => {
        this.$on('confirm', (result: SharedPostDialogResult) => {
          this.isOpenDialog = false;
          resolve(result);
        });
        this.$on('cancel', () => {
          this.isOpenDialog = false;
          resolve();
        });
      });
    },
    onClickedConfirmButton(): void {
      const result: SharedPostDialogResult = {
        postId: this.postId,
        companyNumber: this.companyNumber,
        companyName: this.companyName,
        companyHomepageUrl: this.companyHomepageUrl,
        companyImageUrl: this.companyImageUrl,
        remarks: this.remarks,
        updatedAt: this.updatedAt,
        postDetails: this.postDetails.map((x) => ({
          postDetailId: x.postDetailId,
          no1Content: x.no1Content,
          no1Division: x.no1Division,
        })),
      };
      this.$emit('confirm', result);
    },
    onClickedCloseButton(): void {
      this.$emit('cancel');
    },
  },
});
</script>
