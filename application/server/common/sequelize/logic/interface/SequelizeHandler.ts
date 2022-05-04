import { Sequelize, Transaction } from 'sequelize';

export interface SequelizeHandler {
  // getterをreadonlyで表している
  readonly sequelize: Sequelize;

  /**
   * このメソッド内でトランザクションを張ります
   * コミットは呼び出し側で行ってください
   * ロールバックはエラー時に自動で実行します
   * @param process
   */
  transact(
    process: (transaction: Transaction) => Promise<void> | void,
  ): Promise<void>;
}
