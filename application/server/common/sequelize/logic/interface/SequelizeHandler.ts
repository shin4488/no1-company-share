import { Sequelize, Transaction } from 'sequelize';

export interface SequelizeHandler {
  // getterをreadonlyで表している
  readonly sequelize: Sequelize;

  /**
   * processをトランザクション内で実行する
   * processが正常に終わればコミットし、例外が発生すればロールバックする
   */
  transact(
    process: (transaction: Transaction) => Promise<void> | void,
  ): Promise<void>;
}
