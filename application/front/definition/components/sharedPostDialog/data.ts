/**
 * 会社選択肢のAutoComplete内容
 */
export interface SelectItemAutoComplete {
  text: string;
  value: string;
  disabled: boolean;
  header?: string;
}

/**
 * 投稿詳細
 */
export interface SharedPostDialogDetailData {
  postDetailId: number | null;
  no1Content: string;
  no1Division: string;
}

/**
 * カードに表示する要素データ
 */
export interface SharedPostDialogData {
  isOpenDialog: boolean;
  selectableCompanies: SelectItemAutoComplete[];
  isAutocompleteLoadingShown: boolean;
  imageAlternativeMessage: string;
  isImageLoadingShown: boolean;

  // 投稿関連
  postId: string;
  companyNumber: string;
  companyName: string;
  companyHomepageUrl: string;
  companyImageUrl: string;
  remarks: string;
  updatedAt: string;
  postDetails: SharedPostDialogDetailData[];
}
