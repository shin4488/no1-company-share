import { Transaction } from 'sequelize';
import { UserMasterModelAttribute } from '@s/common/sequelize/models/userMaster';

export interface UserMasterDao {
  upsertUser(
    user: UserMasterModelAttribute,
    transaction: Transaction,
  ): Promise<void>;
}
