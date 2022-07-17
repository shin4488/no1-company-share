import { injectable } from 'inversify';
import { Op, Transaction, WhereOptions } from 'sequelize';
import { SharedPostParameterDto } from './definition/sharedPostParameterDto';
import { SharedPostDao } from './interface/dao';
import { StringUtil } from '@c/util/stringUtil';
import SharedPost from '@s/common/sequelize/models/sharedPost';
import SharedPostDetail from '@s/common/sequelize/models/sharedPostDetail';
import CompanyMaster from '@s/common/sequelize/models/companyMaster';
import UserMaster from '@s/common/sequelize/models/userMaster';
import Bookmark from '@s/common/sequelize/models/bookmark';

@injectable()
export class SharedPostDaoImpl implements SharedPostDao {
  public async getSharedPostWithDetails(
    parameterDto: SharedPostParameterDto,
  ): Promise<SharedPost[]> {
    const sharedPostWhereClause: WhereOptions<SharedPost> = {};

    // 投稿ID指定
    const postId = parameterDto.postId;
    if (StringUtil.isNotEmpty(postId)) {
      sharedPostWhereClause.id = { [Op.eq]: postId };
    }

    // 更新日時が基準日時以前
    const baseDateTimeParameter = parameterDto.baseDateTime;
    if (baseDateTimeParameter !== null) {
      sharedPostWhereClause.updatedAt = { [Op.lt]: baseDateTimeParameter };
    }

    // ログインユーザの投稿のみ
    const userId = parameterDto.userId;
    if (parameterDto.isMyPostOnly) {
      sharedPostWhereClause.userId = { [Op.eq]: parameterDto.userId };
    }

    const resultDto = await SharedPost.findAll({
      attributes: ['id', 'companyNumber', 'userId', 'remarks', 'updatedAt'],
      include: [
        {
          model: SharedPostDetail,
          attributes: ['id', 'no1Content', 'no1Division'],
          required: true,
        },
        {
          model: Bookmark,
          attributes: ['sharedPostId', 'userId'],
          // お気に入りのみの時は、お気に入りテーブルにレコードが存在するもののみを取得
          required: parameterDto.isMyBookmarkOnly,
          where: {
            userId: { [Op.eq]: userId },
          },
        },
        {
          model: Bookmark,
          attributes: ['sharedPostId'],
          as: 'BookmarksTotalCount',
        },
        {
          model: CompanyMaster,
          attributes: ['companyJapaneseName', 'homepageUrl', 'imageUrl'],
        },
        {
          model: UserMaster,
          attributes: ['iconImageUrl', 'displayedName'],
        },
      ],
      order: [
        ['updatedAt', 'DESC'],
        ['SharedPostDetails', 'id', 'ASC'],
      ],
      limit: parameterDto.limit,
      where: {
        isDeleted: false,
        isReported: false,
        ...sharedPostWhereClause,
      },
    });

    return resultDto;
  }

  public async getNonReportedAliveByCompanyNumbers(
    companyNumbers: string[],
  ): Promise<SharedPost[]> {
    const posts = await SharedPost.findAll({
      attributes: ['companyNumber'],
      where: {
        companyNumber: {
          [Op.in]: companyNumbers,
        },
        isDeleted: false,
        isReported: false,
      },
    });

    return posts;
  }

  public async updateForLogicalDelete(
    sharedPostIds: string[],
    transaction: Transaction,
  ): Promise<void> {
    await SharedPost.update(
      {
        isDeleted: true,
      },
      {
        where: {
          id: {
            [Op.in]: sharedPostIds,
          },
        },
        transaction,
      },
    );
  }
}
