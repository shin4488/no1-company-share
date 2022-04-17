import { Model, Sequelize, DataTypes } from 'sequelize';

interface UserMasterModelAttribute {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserMasterCreationAttribute {
  id: string;
}

/**
 * ユーザマスタ
 */
export default class UserMaster extends Model<
  UserMasterModelAttribute,
  UserMasterCreationAttribute
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
