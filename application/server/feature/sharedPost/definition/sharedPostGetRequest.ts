import { ParsedQs } from 'qs';

/**
 * 投稿取得リクエストURLクエリパラメータ
 */
export interface SharedPostGetRequestQuery extends ParsedQs {
  /**
   * 取得件数の上限
   */
  limit?: string;
  /**
   * 取得基準日時
   * この日時より前に更新された投稿を取得する
   * これがないと、ページングで1ページ目と2ページ目の取得結果が食い違うことがある
   */
  baseDateTime?: string;
  /**
   * ログインユーザの投稿のみ取得
   */
  // 「Authorization」にログインユーザIDトークンが有効なときのみ使用可能
  isMyPostOnly?: string;
}

/**
 * 投稿取得リクエストURL内のルートパラメータ
 */
export interface SharedPostGetRequestParameter {
  postId?: string;
}
