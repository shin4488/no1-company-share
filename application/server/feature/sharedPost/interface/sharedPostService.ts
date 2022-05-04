import { SharedPostGetReponse } from '../definition/sharedPostGetReponse';
import { SharedPostPostParameter } from '../definition/sharedPostPostParameter';
import { SharedPostPostResponse } from '../definition/sharedPostPostResponse';

export interface SharedPostService {
  /**
   * 投稿取得
   */
  getSharedPosts(): Promise<SharedPostGetReponse>;
  /**
   * 投稿新規作成
   * @param parameter
   */
  save(parameter: SharedPostPostParameter): Promise<SharedPostPostResponse>;
}
