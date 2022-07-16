import { inject, injectable } from 'inversify';
import { SharedPostGetResponse } from './definition/sharedPostGetResponse';
import { SharedPostService } from './interface/service';
import { SharedPostPostParameter } from './definition/sharedPostPostParameter';
import {
  SharedPostPostResponse,
  SharedPostPostResponseItem,
} from './definition/sharedPostPostResponse';
import { SharedPostSaveLogic } from './interface/saveLogic';
import { SharedPostComplexValidator } from './interface/complexValidator';
import { SharedPostPutParameter } from './definition/sharedPostPutParameter';
import {
  SharedPostPutResponse,
  SharedPostPutResponseItem,
} from './definition/sharedPostPutResponse';
import { SharedPostGetParameter } from './definition/sharedPostGetParameter';
import { SharedPostDeleteParameter } from './definition/sharedPostDeleteParameter';
import { ReportPostParameter } from './definition/reportPostParameter';
import { types } from '@s/common/dependencyInjection/types';
import { SequelizeHandler } from '@s/common/sequelize/logic/interface/SequelizeHandler';
import CompanyMaster from '@s/common/sequelize/models/companyMaster';
import SharedPost from '@s/common/sequelize/models/sharedPost';
import { SharedPostParameterDto } from '@s/commonBL/dao/sharedPost/definition/sharedPostParameterDto';
import { SharedPostLogic } from '@s/commonBL/sharedPost/interface/logic';
import { SharedPostDao } from '@s/commonBL/dao/sharedPost/interface/dao';

@injectable()
export class SharedPostServiceImpl implements SharedPostService {
  private sequelizeHandler: SequelizeHandler;
  private complexValidator: SharedPostComplexValidator;
  private saveLogic: SharedPostSaveLogic;
  private sharedPostLogic: SharedPostLogic;
  private sharedPostDao: SharedPostDao;

  constructor(
    @inject(types.SequelizeHandler) sequelizeHandler: SequelizeHandler,
    @inject(types.SharedPostComplexValidator)
    complexValidator: SharedPostComplexValidator,
    @inject(types.SharedPostSaveLogic) saveLogic: SharedPostSaveLogic,
    @inject(types.SharedPostLogic) sharedPostLogic: SharedPostLogic,
    @inject(types.SharedPostDao) sharedPostDao: SharedPostDao,
  ) {
    this.sequelizeHandler = sequelizeHandler;
    this.complexValidator = complexValidator;
    this.saveLogic = saveLogic;
    this.sharedPostLogic = sharedPostLogic;
    this.sharedPostDao = sharedPostDao;
  }

  public async getAliveSharedPosts(
    parameter: SharedPostGetParameter,
  ): Promise<SharedPostGetResponse> {
    const parameterDto: SharedPostParameterDto = {
      limit: parameter.limit,
      postId: parameter.postId,
      userId: parameter.userId,
      isMyPostOnly: parameter.isMyPostOnly,
      isMyBookmarkOnly: false,
      baseDateTime: parameter.baseDateTime,
    };
    const responsePosts = await this.sharedPostLogic.getSharedPosts(
      parameterDto,
    );
    const response: SharedPostGetResponse = {
      posts: responsePosts,
    };

    return response;
  }

  public async insertSharedPosts(
    parameter: SharedPostPostParameter,
  ): Promise<SharedPostPostResponse> {
    await this.complexValidator.validateForInsert(parameter);

    const posts = parameter.posts;
    const response: SharedPostPostResponse = { posts: [] };
    await this.sequelizeHandler.transact(async (transaction) => {
      // 会社マスタ更新
      // ホームページURLや会社名変更対応できるように、投稿ごとに書き換える
      // TODO:将来的には複数件一括でupsertしたい
      response.posts = await Promise.all(
        posts.map<Promise<SharedPostPostResponseItem>>(async (post) => {
          const responseItem = await this.saveLogic.createModels(
            post,
            transaction,
            async (company: CompanyMaster): Promise<SharedPost> => {
              // 1企業につき有効な投稿は１つのみ（通報時や削除時には1企業につき複数投稿レコードとなりえるが、投稿時には通報・削除はしない）
              const postId = this.saveLogic.createSharedPostId({
                companyNumber: post.companyNumber,
                userId: parameter.userId,
              });
              const createdPost = await company.createSharedPost(
                {
                  id: postId,
                  userId: parameter.userId,
                  isDeleted: false,
                  isReported: false,
                  remarks: post.remarks,
                },
                {
                  transaction,
                },
              );
              return createdPost;
            },
          );

          return {
            key: post.key,
            id: responseItem.id,
            updatedAt: responseItem.updatedAt,
          };
        }),
      );

      transaction.commit();
    });

    return response;
  }

  public async updateSharedPosts(
    parameter: SharedPostPutParameter,
  ): Promise<SharedPostPutResponse> {
    await this.complexValidator.validateForUpdate(parameter);

    const posts = parameter.posts;
    const response: SharedPostPutResponse = { posts: [] };
    await this.sequelizeHandler.transact(async (transaction) => {
      // 会社マスタ更新
      // ホームページURLや会社名変更対応できるように、投稿ごとに書き換える
      // TODO:将来的には複数件一括でupsertしたい
      response.posts = await Promise.all(
        posts.map<Promise<SharedPostPutResponseItem>>(async (post) => {
          const responseItem = await this.saveLogic.createModels(
            post,
            transaction,
            async (company: CompanyMaster): Promise<SharedPost> => {
              const postId = post.id;
              await SharedPost.update(
                {
                  id: postId,
                  companyNumber: company.companyNumber,
                  userId: parameter.userId,
                  isDeleted: false,
                  isReported: false,
                  remarks: post.remarks,
                },
                {
                  where: {
                    id: postId,
                  },
                  transaction,
                },
              );
              const updatedSharedPost = await SharedPost.findByPk(postId);
              // 更新処理成功後であるため、検索結果はnullになり得ない想定
              return updatedSharedPost as SharedPost;
            },
          );

          return {
            id: responseItem.id,
            updatedAt: responseItem.updatedAt,
          };
        }),
      );

      transaction.commit();
    });

    return response;
  }

  public async deleteSharedPostsLogically(
    parameter: SharedPostDeleteParameter,
  ): Promise<void> {
    await this.complexValidator.validateForDelete(parameter);

    await this.sequelizeHandler.transact(async (transaction) => {
      const parameterPosts = parameter.posts;
      const logicalDeletedPostIds = parameterPosts.map((x) => x.id);
      await this.sharedPostDao.updateForLogicalDelete(
        logicalDeletedPostIds,
        transaction,
      );
      transaction.commit();
    });
  }

  public async reportSharedPosts(
    parameter: ReportPostParameter,
  ): Promise<void> {
    await this.complexValidator.validateForReport(parameter);

    await this.sequelizeHandler.transact(async (transaction) => {
      const parameterPosts = parameter.posts;
      for (const post of parameterPosts) {
        // 既に同じ投稿が通報されている場合は、既存の通報詳細を上書き
        await SharedPost.update(
          {
            reportDetail: post.reportDetail,
            isReported: true,
          },
          {
            where: {
              id: post.id,
            },
            transaction,
          },
        );
      }

      transaction.commit();
    });
  }
}
