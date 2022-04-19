import { Sequelize } from 'sequelize';
import CompanyMaster from './models/companyMaster';
import UserMaster from './models/userMaster';
import { systemLogger } from '@s/common/logger/logHandler';

/**
 * Sequelize操作用クラス
 */
class SequelizeHandler {
  private static _sequelize: Sequelize;

  get sequelize(): Sequelize {
    return SequelizeHandler._sequelize;
  }

  constructor() {
    if (SequelizeHandler._sequelize !== undefined) {
      return;
    }

    this.initialize();
  }

  /**
   * Sequelize初期化
   * @returns Sequelizeインスタンス
   */
  private initialize(): void {
    // SQL出力先をLog4jsに変更
    SequelizeHandler._sequelize = new Sequelize(
      process.env.DB_CONNECTION_URI || '',
      {
        logging: (log) => systemLogger.info(log),
      },
    );

    CompanyMaster.initialize(SequelizeHandler._sequelize);
    UserMaster.initialize(SequelizeHandler._sequelize);
  }
}

const sequelizeInitializer = new SequelizeHandler();
export const sequelize = sequelizeInitializer.sequelize;
