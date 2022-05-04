import { inject, injectable } from 'inversify';
import { Transaction } from 'sequelize';
import { UserSaveParameter } from './definition/userSaveParameter';
import { UserService } from './interface/service';
import { types } from '@s/common/dependencyInjection/types';
import { UserMasterModelAttribute } from '@s/common/sequelize/models/userMaster';
import { UserMasterDao } from '@s/commonBL/dao/user/interface/dao';
import { SequelizeHandler } from '@s/common/sequelize/logic/interface/SequelizeHandler';

@injectable()
export class UserServiceImpl implements UserService {
  private sequelizeHandler: SequelizeHandler;
  private userMasterDao: UserMasterDao;

  constructor(
    @inject(types.SequelizeHandler) sequelizeHandler: SequelizeHandler,
    @inject(types.UserMasterDao) userMasterDao: UserMasterDao,
  ) {
    this.sequelizeHandler = sequelizeHandler;
    this.userMasterDao = userMasterDao;
  }

  async save(parameter: UserSaveParameter): Promise<void> {
    const userMaster: UserMasterModelAttribute = {
      id: parameter.id,
      iconImageUrl: parameter.iconImageUrl,
      displayedName: parameter.displayedName,
    };

    await this.sequelizeHandler.transact(async (transaction: Transaction) => {
      await this.userMasterDao.upsertUser(userMaster, transaction);
      transaction.commit();
    });
  }
}
