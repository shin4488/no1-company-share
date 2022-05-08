import { inject, injectable } from 'inversify';
import { SharedPostGetReponse } from './definition/sharedPostGetReponse';
import { SharedPostService } from './interface/sharedPostService';
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
import { OpenGraphLogic } from '@s/commonBL/openGraph/interface/logic';
import { types } from '@s/common/dependencyInjection/types';
import { OpenGraphType } from '@s/commonBL/openGraph/definition/openGraphType';
import { SequelizeHandler } from '@s/common/sequelize/logic/interface/SequelizeHandler';
import CompanyMaster from '@s/common/sequelize/models/companyMaster';
import SharedPost from '@s/common/sequelize/models/sharedPost';

@injectable()
export class SharedPostServiceImpl implements SharedPostService {
  private openGraphLogic: OpenGraphLogic;
  private sequelizeHandler: SequelizeHandler;
  private complexValidator: SharedPostComplexValidator;
  private saveLogic: SharedPostSaveLogic;

  constructor(
    @inject(types.OpenGraphLogic) openGraphLogic: OpenGraphLogic,
    @inject(types.SequelizeHandler) sequelizeHandler: SequelizeHandler,
    @inject(types.SharedPostComplexValidator)
    complexValidator: SharedPostComplexValidator,
    @inject(types.SharedPostSaveLogic) saveLogic: SharedPostSaveLogic,
  ) {
    this.openGraphLogic = openGraphLogic;
    this.sequelizeHandler = sequelizeHandler;
    this.complexValidator = complexValidator;
    this.saveLogic = saveLogic;
  }

  public async getSharedPosts(): Promise<SharedPostGetReponse> {
    const response: SharedPostGetReponse = await {
      posts: [
        {
          id: 'testpost1',
          companyNumber: 'testcompany1',
          companyName: 'テスト株式会社1',
          companyHomepageUrl:
            'https://zenn.dev/littleforest/articles/scrape-og-tags',
          companyImageUrl: '',
          postingUserId: '0yC8iU1797VrDALJsG4siIU6C382',
          postingUserName: 'S. U.',
          postingUserIcomImageUrl:
            'https://lh3.googleusercontent.com/a/AATXAJyZSD8UjGl1eF9s-OtXTO6uECzHcMZ0y5HtO1Ei=s96-c',
          isBookmarkedByLoginUser: false,
          numberOfBookmarks: 4321,
          remarks: '2020年度3月期有価証券報告書',
          updatedAt: '2022-05-03T03:19:17.238Z',
          postDetails: [
            {
              id: 1,
              no1Content: '何かを作ること',
              no1Division: '1',
            },
          ],
        },
        {
          id: 'testpost2',
          companyNumber: 'testcompany2',
          companyName: 'qwertyuiop asdfghjkl zxcvbnm qwertyuiop',
          companyHomepageUrl: 'http://example.com/',
          companyImageUrl: '',
          postingUserId: 'testuser1',
          postingUserName: 'abcdefghijklmn opqrstu vvvvvvv',
          postingUserIcomImageUrl:
            'https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg',
          isBookmarkedByLoginUser: true,
          numberOfBookmarks: 999,
          remarks:
            'http://example.com/ 2020年度3月期有価証券報告書テストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテスト',
          updatedAt: '2022-05-02T03:19:17.238Z',
          postDetails: [
            {
              id: 1,
              no1Content:
                'テストテストテストテストテストテストテストテストテストテストテストテスト',
              no1Division: '1',
            },
            {
              id: 2,
              no1Content: 'テストテストテスト',
              no1Division: '2',
            },
          ],
        },
        {
          id: 'testpost3',
          companyNumber: 'testcompany3',
          companyName: 'テスト株式会社テスト株式会社テスト株式会社3',
          companyHomepageUrl: 'aaa',
          companyImageUrl: '',
          postingUserId: 'testuser1',
          postingUserName: '山田太郎',
          postingUserIcomImageUrl:
            'https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg',
          isBookmarkedByLoginUser: false,
          numberOfBookmarks: 0,
          remarks: '',
          updatedAt: '2022-05-01T03:19:17.238Z',
          postDetails: [
            {
              id: 1,
              no1Content: 'テストテストテスト',
              no1Division: '1',
            },
          ],
        },
        {
          id: 'testpost4',
          companyNumber: 'testcompany4',
          companyName: 'テスト株式会社4',
          companyHomepageUrl:
            'https://ja.wikipedia.org/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8',
          companyImageUrl: '',
          postingUserId: '0yC8iU1797VrDALJsG4siIU6C382',
          postingUserName: 'abcdefghijklmn opqrstu vvvvvvv',
          postingUserIcomImageUrl:
            'https://lh3.googleusercontent.com/a/AATXAJyZSD8UjGl1eF9s-OtXTO6uECzHcMZ0y5HtO1Ei=s96-c',
          isBookmarkedByLoginUser: true,
          numberOfBookmarks: 1000,
          remarks: '2020年度3月期有価証券報告書',
          updatedAt: '2022-05-01T00:19:17.238Z',
          postDetails: [
            {
              id: 1,
              no1Content: 'qwertyuiop asdfghjkl zxcvbnm qwertyuiop',
              no1Division: '1',
            },
            {
              id: 2,
              no1Content: "<script>alert('okok')</script>",
              no1Division: '1',
            },
          ],
        },
        {
          id: 'testpost5',
          companyNumber: 'testcompany5',
          companyName: 'テスト株式会社5',
          companyHomepageUrl: '',
          companyImageUrl: '',
          postingUserId: '0yC8iU1797VrDALJsG4siIU6C382',
          postingUserName: 'あいうえおかきくけこ　さしすせそたちつてと',
          postingUserIcomImageUrl:
            'https://lh3.googleusercontent.com/a/AATXAJyZSD8UjGl1eF9s-OtXTO6uECzHcMZ0y5HtO1Ei=s96-c',
          isBookmarkedByLoginUser: true,
          numberOfBookmarks: 100500,
          remarks: '2020年度3月期有価証券報告書\nテスト改行',
          updatedAt: '2022-04-11 10:30:59.999',
          postDetails: [
            {
              id: 1,
              no1Content: 'qwertyuiop asdfghjkl zxcvbnm qwertyuiop',
              no1Division: '1',
            },
            {
              id: 2,
              no1Content: "<script>alert('okok')</script>",
              no1Division: '1',
            },
          ],
        },
      ],
    };

    // 会社ホームページURLからOG画像取得
    response.posts = await Promise.all(
      response.posts.map(async (post) => {
        const ogResult = await this.openGraphLogic.getOpenGraph(
          post.companyHomepageUrl,
          [OpenGraphType.IMAGE],
        );
        post.companyImageUrl = ogResult.image;
        return post;
      }),
    );

    return response;
  }

  public async insert(
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

  public async update(
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
              const [createdPost] = await SharedPost.upsert(
                {
                  id: post.id,
                  companyNumber: company.companyNumber,
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
            id: responseItem.id,
            updatedAt: responseItem.updatedAt,
          };
        }),
      );

      transaction.commit();
    });

    return response;
  }
}
