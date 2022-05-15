import { Transaction } from 'sequelize';
import { SharedPostParameterDto } from '../definition/sharedPostParameterDto';
import SharedPost from '@s/common/sequelize/models/sharedPost';

export interface SharedPostDao {
  getSharedPostWithDetails(
    parameterDto: SharedPostParameterDto,
  ): Promise<SharedPost[]>;
  getNonReportedAliveByCompanyNumbers(
    companyNumbers: string[],
  ): Promise<SharedPost[]>;
  updateForLogicalDelete(
    sharedPostIds: string[],
    transaction: Transaction,
  ): Promise<void>;
}
