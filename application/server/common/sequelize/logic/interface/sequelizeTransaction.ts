import { Transaction } from 'sequelize';

export interface SequelizeTransaction {
  /**
   * このメソッド内でトランザクションを張ります
   * コミットは呼び出し側で行ってください
   * ロールバックはエラー時に自動で実行します
   * @param process
   */
  transact(process: (transaction: Transaction) => Promise<void>): Promise<void>;
}
