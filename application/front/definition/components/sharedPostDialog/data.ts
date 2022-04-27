/**
 * 投稿詳細
 */
export interface PostDialogDetail {
  postDetailId: number;
  no1Content: string;
  no1Division: string;
}

/**
 * カードに表示する要素データ
 */
export interface SharedPostDialog {
  isOpenDialog: boolean;

  // 投稿関連
  postId: string;
  companyNumber: string;
  companyName: string;
  companyHomepageUrl: string;
  companyImageUrl: string;
  remarks: string;
  updatedAt: string;
  postDetails: PostDialogDetail[];
}
