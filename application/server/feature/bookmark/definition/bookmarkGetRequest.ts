import { ParsedQs } from 'qs';

export interface BookmarkGetRequest extends ParsedQs {
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
}
