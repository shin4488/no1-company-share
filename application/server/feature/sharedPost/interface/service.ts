import { SharedPostGetParameter } from '../definition/sharedPostGetParameter';
import { SharedPostGetResponse } from '../definition/sharedPostGetResponse';
import { SharedPostPostParameter } from '../definition/sharedPostPostParameter';
import { SharedPostPostResponse } from '../definition/sharedPostPostResponse';
import { SharedPostPutParameter } from '../definition/sharedPostPutParameter';
import { SharedPostPutResponse } from '../definition/sharedPostPutResponse';
import { SharedPostDeleteParameter } from '../definition/sharedPostDeleteParameter';
import { ReportPostParameter } from '../definition/reportPostParameter';

export interface SharedPostService {
  /**
   * 投稿取得
   */
  getAliveSharedPosts(
    parameter: SharedPostGetParameter,
  ): Promise<SharedPostGetResponse>;
  /**
   * 投稿新規作成
   * @param parameter
   */
  insertSharedPosts(
    parameter: SharedPostPostParameter,
  ): Promise<SharedPostPostResponse>;
  /**
   * 投稿更新
   * @param parameter
   */
  updateSharedPosts(
    parameter: SharedPostPutParameter,
  ): Promise<SharedPostPutResponse>;
  /**
   * 投稿削除
   * @param parameter
   */
  deleteSharedPostsLogically(
    parameter: SharedPostDeleteParameter,
  ): Promise<void>;
  /**
   * 投稿通報
   * @param parameter
   */
  reportSharedPosts(parameter: ReportPostParameter): Promise<void>;
}
