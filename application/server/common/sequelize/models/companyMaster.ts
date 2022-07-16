import {
  Model,
  Sequelize,
  DataTypes,
  HasManyCreateAssociationMixin,
} from 'sequelize';
import { CommonModelAttribute } from './commonModelAttribute';
import SharedPost from './sharedPost';

export interface CompanyMasterModelAttribute {
  companyNumber: string;
  companyJapaneseName: string;
  homepageUrl: string;
  imageUrl: string;
}

/**
 * 会社マスタ
 */
export default class CompanyMaster extends Model<
  CompanyMasterModelAttribute & CommonModelAttribute,
  CompanyMasterModelAttribute
> {
  declare companyNumber: string;
  declare companyJapaneseName: string;
  declare homepageUrl: string;
  declare imageUrl: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare createSharedPost: HasManyCreateAssociationMixin<
    SharedPost,
    'companyNumber'
  >;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        companyNumber: {
          type: DataTypes.STRING(13),
          primaryKey: true,
        },
        companyJapaneseName: {
          type: new DataTypes.STRING(100),
          allowNull: true,
        },
        homepageUrl: {
          type: new DataTypes.STRING(2100),
          allowNull: true,
        },
        imageUrl: {
          type: new DataTypes.STRING(2100),
          allowNull: true,
        },
      },
      {
        sequelize,
        schema: 'public',
        modelName: 'CompanyMaster',
        tableName: 'company_master',
        underscored: true,
        timestamps: true,
      },
    );
  }

  static associate() {
    this.hasMany(SharedPost, {
      sourceKey: 'companyNumber',
      foreignKey: 'companyNumber',
    });
  }
}
