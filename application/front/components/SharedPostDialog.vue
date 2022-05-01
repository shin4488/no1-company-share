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
              v-model="companyNumber"
              :items="selectableCompanies"
              :disabled="isEditMode"
              label="会社名"
              clearable
              append-icon="mdi-magnify"
              @keydown="onChangedSearchedCompanyText"
              @change="onClickedCompany"
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
          <v-col sm="8" cols="9">
            <v-text-field
              v-model="companyHomepageUrl"
              :label="companyHomePageUrlInputLabelComputed"
              clearable
              @blur="onBluredCompanyHomePageUrl"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex align-start justify-center" sm="4" cols="3">
            <div>
              <Spinner :show="isImageLoadingShown" />
            </div>
            <div
              v-if="!isImageLoadingShown && hasImageAlternativeMessageComputed"
              v-text="imageAlternativeMessage"
            />
            <v-img
              v-if="
                !(isImageLoadingShown || hasImageAlternativeMessageComputed)
              "
              contain
              height="100"
              :title="companyName"
              :alt="companyName"
              :src="companyImageUrl"
            />
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
        <v-btn
          :disabled="disabledConfirmButton"
          color="primary"
          @click="onClickedConfirmButton"
          >確定</v-btn
        >
        <v-btn @click="onClickedCloseButton">閉じる</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { SelectItem } from '@f/definition/common/selectItem';
import { AjaxHelper } from '@f/common/ajax/ajaxHelper';
import { StringUtil } from '@c/util/stringUtil';
import { ArrayUtil } from '@c/util/arrayUtil';
import { SharedPostDialogData } from '@f/definition/components/sharedPostDialog/data';
import { SharedPostDialogParameter } from '@f/definition/components/sharedPostDialog/parameter';
import { SharedPostDialogResult } from '@f/definition/components/sharedPostDialog/result';
import { OpenGraphGetRequest } from '@f/definition/components/sharedPostDialog/apiSpec/openGraphGetRequest';
import { OpenGraphGetResponse } from '@f/definition/components/sharedPostDialog/apiSpec/openGraphGetResponse';

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
      selectableCompanies: [],
      imageAlternativeMessage: '',
      isImageLoadingShown: false,

      // 投稿関連
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
    /**
     * 新規投稿の作成中ではなく、既存投稿の編集中である
     */
    isEditMode(): boolean {
      return StringUtil.isNotEmpty(this.postId);
    },
    /**
     * No.1内容の削除が不可である
     */
    disabledToDeleteDetail(): boolean {
      // 詳細1つのみの場合は消去できないようにする
      const hasNoOrOneDetail = this.postDetails.length <= 1;
      return hasNoOrOneDetail;
    },
    /**
     * 確定ボタンが非活性である
     */
    disabledConfirmButton(): boolean {
      return (
        StringUtil.isEmpty(this.companyNumber) ||
        this.postDetails.every(
          (x) =>
            StringUtil.isEmpty(x.no1Content) ||
            StringUtil.isEmpty(x.no1Division),
        ) ||
        // 画像データ取得できるように、画像ローディング中は確定できない
        this.isImageLoadingShown
      );
    },
    /**
     * 会社HPのURL入力ラベル
     */
    companyHomePageUrlInputLabelComputed: (): string => '会社ホームページURL',
    /**
     * 会社HP未入力時の画像代替メッセージ
     */
    imageAlternativeMessageWithoutHomepage(): string {
      return `${this.companyHomePageUrlInputLabelComputed}入力後、画像が表示されます。`;
    },
    /**
     * 会社HP入力済時の画像代替メッセージ
     */
    imageAlternativeMessageWithHomepage: (): string => '画像を取得できません。',
    /**
     * 画像代替メッセージが存在する
     */
    hasImageAlternativeMessageComputed(): boolean {
      return StringUtil.isNotEmpty(this.imageAlternativeMessage);
    },
  },
  mounted() {
    this.selectableCompanies = [
      {
        text: 'あいうえお かきくけこ　さしすせそ',
        value: 'aiueo',
        disabled: false,
      },
      {
        text: 'あいうえお かき',
        value: 'aiueo2',
        disabled: true,
        subtitle: 'すでにこの会社は登録済みです。',
      },
      {
        text: 'aaaa bbb cccccccccccccccccc ddd',
        value: 'alfa',
        disabled: true,
        subtitle: 'すでにこの会社は登録済みです。',
      },
      {
        text: 'aaaa bbb ccccccccc ee',
        value: 'alfa2',
        disabled: false,
      },
    ];
  },
  methods: {
    /**
     * ダイアログ起動
     */
    open(
      parameter: SharedPostDialogParameter,
    ): Promise<SharedPostDialogResult | void> {
      this.isOpenDialog = true;
      const homepageUrl = parameter.companyHomepageUrl;
      const imageUrl = parameter.companyImageUrl;
      const hasHomePage = StringUtil.isNotEmpty(homepageUrl);
      const hasImage = StringUtil.isNotEmpty(imageUrl);
      const hasHomePageNoImage = hasHomePage && !hasImage;
      const hasNoHomePageNoImage = !(hasHomePage || hasImage);
      this.imageAlternativeMessage = hasHomePageNoImage
        ? this.imageAlternativeMessageWithHomepage
        : hasNoHomePageNoImage
        ? this.imageAlternativeMessageWithoutHomepage
        : '';
      // 起動時は設定されている会社名を選択状態とする
      const companyNumber = parameter.companyNumber;
      const companyName = parameter.companyName;
      if (StringUtil.isNotEmpty(companyNumber)) {
        this.selectableCompanies = [
          {
            text: companyName,
            value: companyNumber,
            disabled: true,
          },
        ];
      }

      this.postId = parameter.postId;
      this.companyNumber = companyNumber;
      this.companyName = companyName;
      this.companyHomepageUrl = homepageUrl;
      this.companyImageUrl = imageUrl;
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
     * 会社名入力処理
     */
    onChangedSearchedCompanyText(event: KeyboardEvent) {
      if (event.code !== 'Enter') {
        return;
      }

      const eventTarget = event.target;
      if (!(eventTarget instanceof HTMLInputElement)) {
        return;
      }

      console.log(eventTarget.value);
      // TODO:企業検索処理呼び出し
    },
    /**
     * 会社選択時処理
     */
    onClickedCompany(selectedCompanyNumber: string) {
      const selectedCompanySelectItem = this.selectableCompanies.find(
        (x) => x.value === selectedCompanyNumber,
      );
      const selectedCompanyName = selectedCompanySelectItem?.text;
      this.companyName = StringUtil.ifEmpty(selectedCompanyName);
      this.companyNumber = selectedCompanyNumber;
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
    /**
     * 会社ページURLフォーカスを外した時の処理
     */
    async onBluredCompanyHomePageUrl() {
      if (StringUtil.isEmpty(this.companyHomepageUrl)) {
        this.imageAlternativeMessage =
          this.imageAlternativeMessageWithoutHomepage;
        this.companyImageUrl = '';
        return;
      }

      this.isImageLoadingShown = true;
      this.imageAlternativeMessage = this.imageAlternativeMessageWithHomepage;
      const parameterQuery: OpenGraphGetRequest = {
        pageUris: [this.companyHomepageUrl],
      };
      const result = await AjaxHelper.get<OpenGraphGetResponse>(
        this.$axios,
        '/open-graph/',
        parameterQuery,
      );
      this.isImageLoadingShown = false;
      // 会社URLを入力したがOG画像を取得できない時は画像URLをクリアする
      if (result === null) {
        this.companyImageUrl = '';
        return;
      }

      const results = result.openGraphList;
      if (ArrayUtil.isEmpty(results)) {
        this.companyImageUrl = '';
        return;
      }

      this.imageAlternativeMessage = '';
      this.companyImageUrl = results[0].imageUri;
    },
  },
});
</script>
