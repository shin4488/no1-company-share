/**
 * 投稿詳細取得レスポンス
 */
export interface SharedPostGetDetailsReponse {
  id: number | null;
  no1Content: string | null;
  no1Division: string | null;
}

/**
 * 投稿取得レスポンス
 * 投稿データ
 */
export interface SharedPostGetPostsReponse {
  id: string | null;
  companyNumber: string | null;
  companyName: string | null;
  companyHomepageUrl: string | null;
  companyImageUrl: string | null;
  postingUserId: string | null;
  postingUserName: string | null;
  postingUserIcomImageUrl: string | null;
  isBookmarkedByLoginUser: boolean | null;
  numberOfBookmarks: number | null;
  remarks: string | null;
  updatedAt: string | null;
  postDetails: SharedPostGetDetailsReponse[];
}

/**
 * 投稿取得レスポンス
 * data直下のルート
 */
export interface SharedPostGetReponse {
  posts: SharedPostGetPostsReponse[];
}
