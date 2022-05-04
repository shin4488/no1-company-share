import { injectable } from 'inversify';
import { Transaction } from 'sequelize';
import { UserMasterDao } from './interface/dao';
import UserMaster, {
  UserMasterModelAttribute,
} from '@s/common/sequelize/models/userMaster';

@injectable()
export class UserMasterDaoImpl implements UserMasterDao {
  public async upsertUser(
    user: UserMasterModelAttribute,
    transaction: Transaction,
  ): Promise<void> {
    await UserMaster.upsert(
      {
        id: user.id,
        iconImageUrl: user.iconImageUrl,
        displayedName: user.displayedName,
      },
      { transaction },
    );
  }
}
