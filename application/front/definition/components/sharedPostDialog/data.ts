/**
 * 会社選択肢のAutoComplete内容
 */
export interface SelectItemAutoComplete {
  text: string;
  value: string;
  disabled: boolean;
  /**
   * 候補の会社名の下に表示する補足。空文字でも空の行が表示されるため、補足がないときはundefinedにする
   */
  subtitle?: string;
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
 * 投稿ダイアログのデータ
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
