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
              :loading="isAutocompleteLoadingShown"
              append-icon="mdi-magnify"
              @click:clear="onClickedAutocompleteClear"
              @change="onClickedCompany"
              @update:search-input="onChangedSearchedCompanyText"
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
          <v-col offset="1" cols="1">
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

    <ConfirmDialog ref="confirmDialog" />
  </v-dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { SelectItem } from '@f/definition/common/selectItem';
import { AjaxHelper } from '@f/common/ajax/ajaxHelper';
import { StringUtil } from '@c/util/stringUtil';
import { ArrayUtil } from '@c/util/arrayUtil';
import {
  SelectItemAutoComplete,
  SharedPostDialogData,
} from '@f/definition/components/sharedPostDialog/data';
import { SharedPostDialogParameter } from '@f/definition/components/sharedPostDialog/parameter';
import { SharedPostDialogResult } from '@f/definition/components/sharedPostDialog/result';
import { OpenGraphGetRequest } from '@f/definition/components/sharedPostDialog/apiSpec/openGraphGetRequest';
import { OpenGraphGetResponse } from '@f/definition/components/sharedPostDialog/apiSpec/openGraphGetResponse';
import { CompanyGetResponse } from '@f/definition/components/sharedPostDialog/apiSpec/companyGetResponse';
import ConfirmDialog from '@f/components/ConfirmDialog.vue';
import { SharedPostPostRequest } from '@f/definition/components/sharedPostDialog/apiSpec/sharedPostPostRequest';
import { SharedPostPostResponse } from '@f/definition/components/sharedPostDialog/apiSpec/sharedPostPostResponse';

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
      isAutocompleteLoadingShown: false,
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
  methods: {
    /**
     * ダイアログ起動
     */
    async open(
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
      const companyNumber = parameter.companyNumber;
      const companyName = parameter.companyName;
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

      // 起動時は、会社が選択済みの場合は選択した会社を表示、なければ会社リストを取得
      if (StringUtil.isNotEmpty(companyNumber)) {
        this.selectableCompanies = [
          {
            text: companyName,
            value: companyNumber,
            disabled: true,
          },
        ];
      } else {
        this.selectableCompanies = await this.getMatchedCompanies('');
      }

      return new Promise((resolve) => {
        this.$on('confirm', (result: SharedPostDialogResult) => {
          this.isOpenDialog = false;
          this.clear();
          resolve(result);
        });
        this.$on('cancel', () => {
          this.isOpenDialog = false;
          this.clear();
          resolve();
        });
      });
    },
    /**
     * 確定ボタン押下処理
     */
    async onClickedConfirmButton(): Promise<void> {
      let hasError = false;
      // TODO:投稿登録（postIdが空）・更新（postIdが非空）処理
      await this.$accessor.spinnerOverlay.open(async () => {
        const request: SharedPostPostRequest = {
          posts: [
            {
              companyNumber: this.companyNumber,
              companyName: this.companyName,
              companyHomepageUrl: this.companyHomepageUrl,
              remarks: this.remarks,
              postDetails: this.postDetails.map((detail, index) => ({
                key: StringUtil.toString(index),
                no1Content: detail.no1Content,
                no1Division: detail.no1Division,
              })),
            },
          ],
        };
        const response = await AjaxHelper.post<SharedPostPostResponse>(
          this.$axios,
          '/shared-posts/',
          request,
        );
        if (response === null) {
          hasError = true;
          return;
        }

        const responsePosts = response.posts;
        if (ArrayUtil.isEmpty(responsePosts)) {
          hasError = true;
          return;
        }

        const responsePost = responsePosts[0];
        this.postId = StringUtil.ifEmpty(responsePost.id);
        this.updatedAt = StringUtil.ifEmpty(responsePost.updatedAt);
        const responsePostDetails = responsePost.postDetails;
        responsePostDetails.forEach((detail) => {
          this.postDetails[Number(detail.key)].postDetailId = detail.id;
        });
      });

      // レスポンスボディや投稿レスポンスが存在しない場合はエラーとみなしてダイアログを閉じない
      if (hasError) {
        return;
      }

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
      console.log(result);
      this.$emit('confirm', result);
    },
    /**
     * 閉じるボタン押下処理
     */
    async onClickedCloseButton(): Promise<void> {
      const confirmDialog = this.$refs.confirmDialog as InstanceType<
        typeof ConfirmDialog
      >;
      const isConfirmed = await confirmDialog.open(
        '編集内容が破棄されます。よろしいですか。',
      );
      if (isConfirmed) {
        this.$emit('cancel');
      }
    },
    /**
     * 会社名入力処理
     */
    async onChangedSearchedCompanyText(text: string): Promise<void> {
      this.selectableCompanies = await this.getMatchedCompanies(text);
    },
    /**
     * 会社選択AutoCompleteのクリアアイコン押下処理
     */
    async onClickedAutocompleteClear(): Promise<void> {
      // 入力欄をクリアしているため、検索条件は空文字としている
      this.selectableCompanies = await this.getMatchedCompanies('');
    },
    /**
     * 検索条件に一致する会社を取得
     */
    async getMatchedCompanies(
      companyNameText: string,
    ): Promise<SelectItemAutoComplete[]> {
      this.isAutocompleteLoadingShown = true;

      const request = {
        companyName: companyNameText,
      };
      const response = await AjaxHelper.get<CompanyGetResponse>(
        this.$axios,
        '/companies/',
        request,
      );
      if (response === null) {
        return [];
      }

      const companyResonses = response.companies;
      const companies = companyResonses.map<SelectItemAutoComplete>((x) => ({
        // 英数字が全角で返却されるが、autocompleteは半角・全角も区別するため、結果に表示されるように英数字を全角→半角に返却
        text: StringUtil.ifEmpty(x.name)
          .replace(/[Ａ-Ｚａ-ｚ０-９－．＆]/g, (char) =>
            String.fromCharCode(char.charCodeAt(0) - 0xfee0),
          )
          // eslint-disable-next-line no-irregular-whitespace
          .replace(/　/g, ' '),
        value: StringUtil.ifEmpty(x.number),
        disabled: x.isRegistered || false,
        header: x.isRegistered ? `${x.name} （登録済みです）` : '',
      }));

      this.isAutocompleteLoadingShown = false;
      return companies;
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
      this.selectableCompanies = [
        {
          text: this.companyName,
          value: this.companyNumber,
          disabled: false,
        },
      ];
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
      this.companyImageUrl = StringUtil.ifEmpty(results[0].imageUri);
    },
    clear(): void {
      this.selectableCompanies = [];
      this.isAutocompleteLoadingShown = false;
      this.imageAlternativeMessage = '';
      this.isImageLoadingShown = false;

      this.postId = '';
      this.companyNumber = '';
      this.companyName = '';
      this.companyHomepageUrl = '';
      this.companyImageUrl = '';
      this.remarks = '';
      this.postDetails = [
        {
          postDetailId: 0,
          no1Content: '',
          no1Division: '',
        },
      ];
    },
  },
});
</script>
