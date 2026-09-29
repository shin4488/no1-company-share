import { Model, Sequelize, DataTypes, ForeignKey } from 'sequelize';
import { CommonModelAttribute } from './commonModelAttribute';
import type DivisionMaster from './divisionMaster';
import type SharedPost from './sharedPost';

export interface SharedPostDetailModelAttribute {
  id: number;
  sharedPostId: string;
  no1Content: string;
}

export interface SharedPostDetailCreationModelAttribute {
  id: number;
  sharedPostId: string;
  no1Content: string;
  no1Division: number;
}

/**
 * 投稿詳細
 */
export default class SharedPostDetail extends Model<
  SharedPostDetailModelAttribute & CommonModelAttribute,
  SharedPostDetailCreationModelAttribute
> {
  declare id: number;
  declare sharedPostId: ForeignKey<SharedPost['id']>;
  declare no1Content: string;
  declare no1Division: ForeignKey<DivisionMaster['id']>;
  declare createdAt: Date;
  declare updatedAt: Date;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        sharedPostId: {
          type: new DataTypes.STRING(58),
          primaryKey: true,
        },
        no1Content: {
          type: new DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        sequelize,
        schema: 'public',
        modelName: 'SharedPostDetail',
        tableName: 'shared_post_detail',
        underscored: true,
        timestamps: true,
      },
    );
  }

  static associate(
    SharedPost: typeof import('./sharedPost').default,
    DivisionMaster: typeof import('./divisionMaster').default,
  ) {
    this.belongsTo(SharedPost, { targetKey: 'id', foreignKey: 'sharedPostId' });
    this.belongsTo(DivisionMaster, {
      targetKey: 'id',
      foreignKey: 'no1Division',
    });
  }
}
