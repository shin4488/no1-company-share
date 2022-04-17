import { Sequelize } from 'sequelize';
import CompanyMaster from './models/companyMaster';

/**
 * Sequelize操作用クラス
 */
export default class SequelizeHandler {
  private static sequelize: Sequelize;

  /**
   * Sequelize初期化
   * @returns Sequelizeインスタンス
   */
  public static initialize(): Sequelize {
    if (this.sequelize !== undefined) {
      return this.sequelize;
    }

    this.sequelize = new Sequelize(process.env.DB_CONNECTION_URI || '');

    CompanyMaster.initialize(this.sequelize);
    const dir = __dirname;
    import(`./say.js/${dir}`).then((x) => x).catch((e) => console.log(e));

    return this.sequelize;
  }

  /**
   * Sequelizeインスタンスの取得
   * @returns Sequelizeインスタンス
   */
  public static getInstance(): Sequelize {
    if (this.sequelize === undefined) {
      SequelizeHandler.initialize();
    }

    return this.sequelize;
  }
}
