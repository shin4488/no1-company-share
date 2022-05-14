import {
  Model,
  Sequelize,
  DataTypes,
  ForeignKey,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  NonAttribute,
} from 'sequelize';
import Bookmark from './bookmark';
import { CommonModelAttribute } from './commonModelAttribute';
import CompanyMaster from './companyMaster';
import SharedPostDetail from './sharedPostDetail';
import UserMaster from './userMaster';

export interface SharedPostModelAttribute {
  id: string;
  isDeleted: boolean;
  isReported: boolean;
  reportDetail: string;
  remarks: string;
}

export interface SharedPostModelCreationAttribute {
  id: string;
  companyNumber: string;
  userId: string;
  isDeleted: boolean;
  isReported: boolean;
  reportDetail: string | null;
  remarks: string | null;
}

/**
 * 投稿
 */
export default class SharedPost extends Model<
  SharedPostModelAttribute & CommonModelAttribute,
  SharedPostModelCreationAttribute
> {
  declare id: string;
  declare companyNumber: ForeignKey<CompanyMaster['companyNumber']>;
  declare userId: ForeignKey<UserMaster['id']>;
  declare isDeleted: boolean;
  declare isReported: boolean;
  declare reportDetail: string;
  declare remarks: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare SharedPostDetails?: NonAttribute<SharedPostDetail[]>;
  declare Bookmarks?: NonAttribute<Bookmark[]>;
  declare UserMaster?: NonAttribute<UserMaster>;
  declare CompanyMaster?: NonAttribute<CompanyMaster>;

  declare createSharedPostDetail: HasManyCreateAssociationMixin<
    SharedPostDetail,
    'sharedPostId'
  >;

  // TODO:associationでalias設定時はこのメソッドが動作しなくなる
  declare getSharedPostDetails: HasManyGetAssociationsMixin<SharedPostDetail>;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.STRING(58),
          primaryKey: true,
        },
        // companyNumber: {
        //   type: new DataTypes.STRING(13),
        //   allowNull: false,
        // },
        // userId: {
        //   type: new DataTypes.STRING(28),
        //   allowNull: false,
        // },
        isDeleted: {
          type: new DataTypes.BOOLEAN(),
          allowNull: false,
        },
        isReported: {
          type: new DataTypes.BOOLEAN(),
          allowNull: false,
        },
        reportDetail: {
          type: new DataTypes.STRING(300),
          allowNull: true,
        },
        remarks: {
          type: new DataTypes.STRING(500),
          allowNull: true,
        },
      },
      {
        sequelize,
        schema: 'public',
        modelName: 'SharedPost',
        tableName: 'shared_post',
        underscored: true,
        timestamps: true,
      },
    );
  }

  static associate() {
    this.belongsTo(CompanyMaster, {
      targetKey: 'companyNumber',
      foreignKey: 'companyNumber',
    });
    this.belongsTo(UserMaster, {
      targetKey: 'id',
      foreignKey: 'userId',
    });

    this.hasMany(SharedPostDetail, {
      sourceKey: 'id',
      foreignKey: 'sharedPostId',
    });
    this.hasMany(Bookmark, {
      sourceKey: 'id',
      foreignKey: 'sharedPostId',
    });
  }
}
