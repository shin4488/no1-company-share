/**
 * 投稿取得リクエストURLクエリパラメータ
 */
export interface SharedPostGetRequestQuery {
  /**
   * 取得件数の上限
   */
  limit: number;
  /**
   * 取得基準日時
   * この時刻以前のデータを取得
   */
  baseDateTime: string | null;
  /**
   * ログインユーザの投稿のみ取得
   */
  // 「Authorization」にログインユーザIDトークンが有効なときのみ使用可能
  isMyPostOnly: boolean;
}
