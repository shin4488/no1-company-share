<template>
  <v-dialog v-model="isOpenDialog" scrollable persistent>
    <v-card>
      <v-toolbar color="primary" dark
        >No.1企業投稿
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark right @click="onClickedCloseButton">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text>
        <v-row dense>
          <v-col>
            <v-autocomplete
              :readonly="isEditMode"
              label="会社名"
              clearable
              append-icon="mdi-magnify"
            ></v-autocomplete>
          </v-col>
        </v-row>

        <v-row
          v-for="(item, index) in postDetails"
          :key="index"
          align="center"
          dense
        >
          <v-col cols="1">
            <v-icon
              :disabled="disabledToDeleteDetail"
              dense
              color="error"
              title="1位内容の削除"
              @click="onClickedNo1ContentDeleteButton(index)"
            >
              mdi-delete
            </v-icon>
          </v-col>
          <v-col sm="7" cols="6">
            <v-text-field
              v-model="item.no1Content"
              label="No.1の内容"
              clearable
              required
            ></v-text-field>
          </v-col>
          <v-col sm="4" cols="5">
            <v-select
              v-model="item.no1Division"
              :items="no1Divisions"
              required
            ></v-select>
          </v-col>
        </v-row>
        <v-row align="start" dense>
          <v-col cols="1">
            <v-icon
              title="1位内容の追加"
              dense
              color="primary"
              @click="onClickedNo1ContentAddButton"
            >
              mdi-plus
            </v-icon>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col sm="6" cols="12">
            <v-text-field
              v-model="companyHomepageUrl"
              label="会社ホームページURL"
              clearable
            ></v-text-field>
          </v-col>
          <v-col sm="6" cols="12">
            <v-text-field
              v-model="companyImageUrl"
              label="会社画像URL"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col>
            <v-textarea
              v-model="remarks"
              label="詳細"
              hint="投稿内容の説明や出典など"
              persistent-hint
              rows="2"
              dense
              auto-grow
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="onClickedConfirmButton">確定</v-btn>
        <v-btn @click="onClickedCloseButton">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { SelectItem } from '@f/definition/common/selectItem';
import { StringUtil } from '@c/util/stringUtil';
import { SharedPostDialogData } from '@f/definition/components/sharedPostDialog/data';
import { SharedPostDialogParameter } from '@f/definition/components/sharedPostDialog/parameter';
import { SharedPostDialogResult } from '@f/definition/components/sharedPostDialog/result';
import { ArrayUtil } from '@c/util/arrayUtil';

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
  data(): SharedPostDialogData {
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
  computed: {
    isEditMode(): boolean {
      return StringUtil.isNotEmpty(this.postId);
    },
    disabledToDeleteDetail(): boolean {
      // 詳細1つのみの場合は消去できないようにする
      const hasNoOrOneDetail = this.postDetails.length <= 1;
      return hasNoOrOneDetail;
    },
  },
  methods: {
    /**
     * ダイアログ起動
     */
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
    /**
     * 確定ボタン押下処理
     */
    onClickedConfirmButton(): void {
      // TODO:投稿登録（postIdが空）・更新（postIdが非空）処理
      const result: SharedPostDialogResult = {
        postId: this.postId,
        companyNumber: this.companyNumber,
        companyName: this.companyName,
        companyHomepageUrl: this.companyHomepageUrl,
        companyImageUrl: this.companyImageUrl,
        remarks: this.remarks,
        updatedAt: this.updatedAt,
        postDetails: this.postDetails.map((x) => ({
          // TODO:dataではなくAPIレスポンスを返却値に指定
          postDetailId: x.postDetailId || 0,
          no1Content: x.no1Content,
          no1Division: x.no1Division,
        })),
      };
      this.$emit('confirm', result);
    },
    /**
     * 閉じるボタン押下処理
     */
    onClickedCloseButton(): void {
      this.$emit('cancel');
    },
    /**
     * No.1内容削除ボタン押下処理
     */
    onClickedNo1ContentDeleteButton(detailIndex: number): void {
      this.postDetails.splice(detailIndex, 1);
    },
    /**
     * No.1内容追加ボタン押下処理
     */
    onClickedNo1ContentAddButton() {
      const firstNo1Division = ArrayUtil.isNotEmpty(this.no1Divisions)
        ? this.no1Divisions[0].value
        : '';
      this.postDetails.push({
        postDetailId: this.postDetails.length,
        no1Content: '',
        no1Division: firstNo1Division,
      });
    },
  },
});
</script>
