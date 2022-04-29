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
