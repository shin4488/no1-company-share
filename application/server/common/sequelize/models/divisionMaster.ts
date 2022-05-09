import { Model, Sequelize, DataTypes } from 'sequelize';
import { CommonModelAttribute } from './commonModelAttribute';
import SharedPostDetail from './sharedPostDetail';

export interface DivisionMasterModelAttribute {
  id: number;
  columnPhysicalName: string;
  divisionDisplayedName: string;
}

/**
 * 区分値マスタ
 */
export default class DivisionMaster extends Model<
  DivisionMasterModelAttribute & CommonModelAttribute,
  DivisionMasterModelAttribute
> {
  declare id: number;
  declare columnPhysicalName: string;
  declare divisionDisplayedName: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        columnPhysicalName: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        divisionDisplayedName: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
      },
      {
        sequelize,
        schema: 'public',
        modelName: 'DivisionMaster',
        tableName: 'division_master',
        underscored: true,
        timestamps: true,
      },
    );
  }

  static associate() {
    this.hasMany(SharedPostDetail, {
      sourceKey: 'id',
      foreignKey: 'no1Division',
    });
  }
}
