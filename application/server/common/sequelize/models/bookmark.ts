import { Model, Sequelize, ForeignKey, DataTypes } from 'sequelize';
import { CommonModelAttribute } from './commonModelAttribute';
import SharedPost from './sharedPost';
import UserMaster from './userMaster';

export interface BookmarkModelAttribute {
  sharedPostId: string;
  userId: string;
}

export interface BookmarkCreationModelAttribute {
  sharedPostId: string;
  userId: string;
}

/**
 * お気に入り
 */
export default class Bookmark extends Model<
  BookmarkModelAttribute & CommonModelAttribute,
  BookmarkCreationModelAttribute
> {
  declare sharedPostId: ForeignKey<SharedPost['id']>;
  declare userId: ForeignKey<UserMaster['id']>;
  declare createdAt: Date;
  declare updatedAt: Date;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        sharedPostId: {
          type: DataTypes.STRING(58),
          primaryKey: true,
          // 投稿削除時にはお気に入りも強制削除（ユーザ削除時も同様）
          onDelete: 'CASCADE',
        },
        userId: {
          type: DataTypes.STRING(28),
          primaryKey: true,
          onDelete: 'CASCADE',
        },
      },
      {
        sequelize,
        schema: 'public',
        modelName: 'Bookmark',
        tableName: 'bookmark',
        underscored: true,
        timestamps: true,
      },
    );
  }

  static associate() {
    this.belongsTo(SharedPost, {
      targetKey: 'id',
      foreignKey: 'sharedPostId',
    });
    this.belongsTo(UserMaster, { targetKey: 'id', foreignKey: 'userId' });
  }
}
