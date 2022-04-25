/**
 * 投稿取得リクエストURLクエリパラメータ
 */
export interface SharedPostGetRequestQuery {
  /**
   * 取得件数の上限
   */
  limit: number;
  /**
   * 取得開始位置
   */
  offset: number;
  /**
   * 取得基準日時
   * この時刻以前のデータを取得
   * これがないとページング時に取得結果のデータが1ページ目の2ページ目で整合性合わなくなる時あり
   */
  baseDateTime: string | null;
  /**
   * ログインユーザの投稿のみ取得
   */
  // 「Authorization」にログインユーザIDトークンが有効なときのみ使用可能
  isMyPostOnly: boolean;
}
