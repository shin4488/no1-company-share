import { Sequelize } from 'sequelize';
import { injectable, inject } from 'inversify';
import CompanyMaster from '../models/companyMaster';
import UserMaster from '../models/userMaster';
import DivisionMaster from '../models/divisionMaster';
import { SequelizeHandler } from './interface/SequelizeHandler';
import { LogHandler } from '@s/common/logger/interface/LogHandler';
import { types } from '@s/common/dependencyInjection/types';

/**
 * Sequelize操作用クラス
 */
@injectable()
export class SequelizeHandlerImpl implements SequelizeHandler {
  private static _sequelize: Sequelize;
  private logger: LogHandler;

  get sequelize(): Sequelize {
    return SequelizeHandlerImpl._sequelize;
  }

  constructor(@inject(types.LogHandler) logger: LogHandler) {
    this.logger = logger;

    // SQL出力先をLog4jsに変更
    SequelizeHandlerImpl._sequelize = new Sequelize(
      process.env.DB_CONNECTION_URI || '',
      {
        logging: (log) => this.logger.log('info', log),
      },
    );
    this.initialize();
  }

  /**
   * Sequelize初期化
   * @returns Sequelizeインスタンス
   */
  private initialize(): void {
    CompanyMaster.initialize(SequelizeHandlerImpl._sequelize);
    UserMaster.initialize(SequelizeHandlerImpl._sequelize);
    DivisionMaster.initialize(SequelizeHandlerImpl._sequelize);
  }
}
