import { Model, Sequelize, DataTypes } from 'sequelize';
import { CommonModelAttribute } from './commonModelAttribute';
import SharedPost from './sharedPost';

export interface UserMasterModelAttribute {
  id: string;
  iconImageUrl: string;
  displayedName: string;
}

/**
 * ユーザマスタ
 */
export default class UserMaster extends Model<
  UserMasterModelAttribute & CommonModelAttribute,
  UserMasterModelAttribute
> {
  declare id: string;
  declare iconImageUrl: string;
  declare displayedName: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.STRING(28),
          primaryKey: true,
        },
        iconImageUrl: {
          type: DataTypes.STRING(2100),
          allowNull: true,
        },
        displayedName: {
          type: DataTypes.STRING(100),
          allowNull: true,
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

  static associate() {
    this.hasMany(SharedPost, { sourceKey: 'id', foreignKey: 'userId' });
  }
}
