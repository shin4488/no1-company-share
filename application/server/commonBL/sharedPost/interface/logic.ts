import { SharedPostLogicResultItem } from '../definition/SharedPostLogicResult';
import { SharedPostParameterDto } from '@s/commonBL/dao/sharedPost/definition/sharedPostParameterDto';

export interface SharedPostLogic {
  getSharedPosts(
    parameter: SharedPostParameterDto,
  ): Promise<SharedPostLogicResultItem[]>;
}
