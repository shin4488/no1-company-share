/**
 * 投稿詳細取得レスポンス
 */
export interface SharedPostGetDetailsReponse {
  id: number;
  no1Content: string;
  no1Division: string;
}

/**
 * 投稿取得レスポンス
 * 投稿データ
 */
export interface SharedPostGetPostsReponse {
  id: string;
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
  updatedAt: string;
  postDetails: SharedPostGetDetailsReponse[];
}

/**
 * 投稿取得レスポンス
 * data直下のルート
 */
export interface SharedPostGetReponse {
  posts: SharedPostGetPostsReponse[];
}
