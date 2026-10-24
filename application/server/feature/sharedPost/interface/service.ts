import { SharedPostGetParameter } from '../definition/sharedPostGetParameter';
import { SharedPostGetResponse } from '../definition/sharedPostGetResponse';
import { SharedPostPostParameter } from '../definition/sharedPostPostParameter';
import { SharedPostPostResponse } from '../definition/sharedPostPostResponse';
import { SharedPostPutParameter } from '../definition/sharedPostPutParameter';
import { SharedPostPutResponse } from '../definition/sharedPostPutResponse';
import { SharedPostDeleteParameter } from '../definition/sharedPostDeleteParameter';
import { ReportPostParameter } from '../definition/reportPostParameter';

export interface SharedPostService {
  getAliveSharedPosts(
    parameter: SharedPostGetParameter,
  ): Promise<SharedPostGetResponse>;
  insertSharedPosts(
    parameter: SharedPostPostParameter,
  ): Promise<SharedPostPostResponse>;
  updateSharedPosts(
    parameter: SharedPostPutParameter,
  ): Promise<SharedPostPutResponse>;
  deleteSharedPostsLogically(
    parameter: SharedPostDeleteParameter,
  ): Promise<void>;
  reportSharedPosts(parameter: ReportPostParameter): Promise<void>;
}
