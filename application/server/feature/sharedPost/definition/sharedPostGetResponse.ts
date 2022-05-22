import { SharedPostLogicResultItem } from '@s/commonBL/sharedPost/definition/SharedPostLogicResult';

/**
 * 投稿取得レスポンス
 * data直下のルート
 */
export interface SharedPostGetResponse {
  posts: SharedPostLogicResultItem[];
}
