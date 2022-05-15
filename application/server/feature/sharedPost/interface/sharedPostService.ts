import { SharedPostGetParameter } from '../definition/sharedPostGetParameter';
import { SharedPostGetResponse } from '../definition/sharedPostGetResponse';
import { SharedPostPostParameter } from '../definition/sharedPostPostParameter';
import { SharedPostPostResponse } from '../definition/sharedPostPostResponse';
import { SharedPostPutParameter } from '../definition/sharedPostPutParameter';
import { SharedPostPutResponse } from '../definition/sharedPostPutResponse';
import { SharedPostDeleteParameter } from '../definition/sharedPostDeleteParameter';

export interface SharedPostService {
  /**
   * 投稿取得
   */
  getAlive(parameter: SharedPostGetParameter): Promise<SharedPostGetResponse>;
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
  /**
   * 投稿削除
   * @param parameter
   */
  logicalDelete(parameter: SharedPostDeleteParameter): Promise<void>;
}
