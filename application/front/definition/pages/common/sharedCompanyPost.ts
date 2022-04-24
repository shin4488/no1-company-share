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
export interface PageAppCardItem {
  postId: string;
  companyNumber: string;
  companyName: string;
  companyHomepageUrl: string;
  companyImageUrl: string;
  postingUserId: string;
  postingUserName: string;
  postingUserIcomImageUrl: string;
  isBookmarkedByLoginUser: boolean;
  numberOfBookmarks: number;
  remarks: string;
  postDetails: PostDetail[];
}
