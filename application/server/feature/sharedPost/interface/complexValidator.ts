import { Transaction } from 'sequelize';
import { SharedPostPostParameter } from '../definition/sharedPostPostParameter';
import { SharedPostPutParameter } from '../definition/sharedPostPutParameter';
import { SharedPostDeleteParameter } from '../definition/sharedPostDeleteParameter';
import { ReportPostParameter } from '../definition/reportPostParameter';

export interface SharedPostComplexValidator {
  validateForInsert(parameter: SharedPostPostParameter): Promise<void>;
  /**
   * 同じユーザーの投稿を保存するトランザクションの中で、同じ企業の投稿がないことを確かめ直す
   */
  validateSameCompanyPostsInTransaction(
    parameter: SharedPostPostParameter,
    transaction: Transaction,
  ): Promise<void>;
  validateForUpdate(parameter: SharedPostPutParameter): Promise<void>;
  validateForDelete(parameter: SharedPostDeleteParameter): Promise<void>;
  validateForReport(parameter: ReportPostParameter): Promise<void>;
}
