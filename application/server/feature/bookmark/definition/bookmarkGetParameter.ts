export interface BookmarkGetParameter {
  limit: number;
  /**
   * 取得基準日時
   * nullのときは更新日時で絞り込まない
   */
  baseDateTime: Date | null;
  postId: string;
  userId: string;
}
