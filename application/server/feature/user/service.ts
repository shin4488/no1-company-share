import { inject, injectable } from 'inversify';
import { Transaction } from 'sequelize';
import { UserSaveParameter } from './definition/userSaveParameter';
import { UserService } from './interface/service';
import { SequelizeTransaction } from '@s/common/sequelize/logic/interface/sequelizeTransaction';
import { types } from '@s/common/dependencyInjection/types';
import { UserMasterModelAttribute } from '@s/common/sequelize/models/userMaster';
import { UserMasterDao } from '@s/commonBL/dao/user/interface/dao';

@injectable()
export class UserServiceImpl implements UserService {
  private sequelizeTransaction: SequelizeTransaction;
  private userMasterDao: UserMasterDao;

  constructor(
    @inject(types.SequelizeTransaction)
    sequelizeTransaction: SequelizeTransaction,
    @inject(types.UserMasterDao) userMasterDao: UserMasterDao,
  ) {
    this.sequelizeTransaction = sequelizeTransaction;
    this.userMasterDao = userMasterDao;
  }

  async save(parameter: UserSaveParameter): Promise<void> {
    const userMaster: UserMasterModelAttribute = {
      id: parameter.id,
      iconImageUrl: parameter.iconImageUrl,
      displayedName: parameter.displayedName,
    };

    await this.sequelizeTransaction.transact(
      async (transaction: Transaction) => {
        await this.userMasterDao.upsertUser(userMaster, transaction);
        transaction.commit();
      },
    );
  }
}
