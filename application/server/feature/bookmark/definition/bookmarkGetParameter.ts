export interface BookmarkGetParameter {
  limit: number;
  /**
   * 取得基準日時
   * 全取得の場合は、nullとなる
   */
  baseDateTime: Date | null;
  postId: string;
  userId: string;
}
