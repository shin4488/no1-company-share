import { inject, injectable } from 'inversify';
import { Transaction } from 'sequelize';
import { SequelizeTransaction } from './interface/sequelizeTransaction';
import { SequelizeHandler } from './interface/SequelizeHandler';
import { types } from '@s/common/dependencyInjection/types';

@injectable()
export class SequelizeTransactionImpl implements SequelizeTransaction {
  private _sequelize: SequelizeHandler;

  constructor(@inject(types.SequelizeHandler) sequelize: SequelizeHandler) {
    this._sequelize = sequelize;
  }

  /**
   * このメソッド内でトランザクションを張ります
   * コミットは呼び出し側で行ってください
   * ロールバックはエラー時に自動で実行します
   * @param process
   */
  public async transact(
    process: (transaction: Transaction) => Promise<void>,
  ): Promise<void> {
    const transaction = await this._sequelize.sequelize.transaction();
    try {
      await process(transaction);
    } catch {
      transaction.rollback();
    }
  }
}
