import { SharedPostGetReponse } from '../definition/sharedPostGetReponse';

export interface SharedPostService {
  /**
   * 投稿取得
   */
  getSharedPosts(): Promise<SharedPostGetReponse>;
}
