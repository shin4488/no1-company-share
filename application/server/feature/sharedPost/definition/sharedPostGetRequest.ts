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
   * この時刻以前のデータを取得
   * これがないとページング時に取得結果のデータが1ページ目の2ページ目で整合性合わなくなる時あり
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
