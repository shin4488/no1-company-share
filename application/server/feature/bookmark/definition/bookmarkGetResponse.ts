import { SharedPostLogicResultItem } from '@s/commonBL/sharedPost/definition/SharedPostLogicResult';

/**
 * お気に入り投稿取得レスポンス
 * data直下のルート
 */
export interface BookmarkGetResponse {
  posts: SharedPostLogicResultItem[];
}
