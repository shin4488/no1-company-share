import { Model, Sequelize, DataTypes } from 'sequelize';
import { CommonModelAttribute } from './commonModelAttribute';

interface UserMasterModelAttribute {
  id: string;
}

/**
 * ユーザマスタ
 */
export default class UserMaster extends Model<
  UserMasterModelAttribute & CommonModelAttribute,
  UserMasterModelAttribute
> {
  declare id: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.STRING(28),
          primaryKey: true,
        },
      },
      {
        sequelize,
        schema: 'public',
        modelName: 'UserMaster',
        tableName: 'user_master',
        underscored: true,
        timestamps: true,
      },
    );
  }
}
