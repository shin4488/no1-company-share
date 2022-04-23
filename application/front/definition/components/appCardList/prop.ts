/**
 * 投稿詳細
 */
export interface PostDetail {
  postDetailId: number;
  no1Content: string;
  no1Division: string;
}

/**
 * カードに表示する要素データ
 */
export interface AppCardItem {
  postId: string;
  companyNumber: string;
  companyName: string;
  companyHomepageUrl: string;
  postingUserId: string;
  postingUserName: string;
  postingUserIcomImageUrl: string;
  numberOfBookmarks: number;
  remarks: string;
  postDetails: PostDetail[];
}
