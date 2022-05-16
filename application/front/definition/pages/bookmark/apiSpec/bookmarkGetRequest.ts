/**
 * 投稿取得リクエストURLクエリパラメータ
 */
export interface BookmarkGetRequestQuery {
  /**
   * 取得件数の上限
   */
  limit: number;
  /**
   * 取得基準日時
   * この時刻以前のデータを取得
   */
  baseDateTime: string | null;
}
