import { SharedPostGetReponse } from '../definition/sharedPostGetReponse';
import { SharedPostPostParameter } from '../definition/sharedPostPostParameter';
import { SharedPostPostResponse } from '../definition/sharedPostPostResponse';
import { SharedPostPutParameter } from '../definition/sharedPostPutParameter';
import { SharedPostPutResponse } from '../definition/sharedPostPutResponse';

export interface SharedPostService {
  /**
   * 投稿取得
   */
  getSharedPosts(): Promise<SharedPostGetReponse>;
  /**
   * 投稿新規作成
   * @param parameter
   */
  insert(parameter: SharedPostPostParameter): Promise<SharedPostPostResponse>;
  /**
   * 投稿更新
   * @param parameter
   */
  update(parameter: SharedPostPutParameter): Promise<SharedPostPutResponse>;
}
