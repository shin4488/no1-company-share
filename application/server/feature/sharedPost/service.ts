import { inject, injectable } from 'inversify';
import { SharedPostGetReponse } from './definition/sharedPostGetReponse';
import { SharedPostService } from './interface/sharedPostService';
import { SharedPostPostParameter } from './definition/sharedPostPostParameter';
import {
  SharedPostDetailResponse,
  SharedPostPostResponse,
  SharedPostPostResponseItem,
} from './definition/sharedPostPostResponse';
import { OpenGraphLogic } from '@s/commonBL/openGraph/interface/logic';
import { types } from '@s/common/dependencyInjection/types';
import { OpenGraphType } from '@s/commonBL/openGraph/definition/openGraphType';
import { CompanyMasterDao } from '@s/commonBL/dao/company/interface/dao';
import { SequelizeHandler } from '@s/common/sequelize/logic/interface/SequelizeHandler';
import { DateHandler } from '@s/common/date/interface/dateHandler';

@injectable()
export class SharedPostServiceImpl implements SharedPostService {
  private openGraphLogic: OpenGraphLogic;
  private companyMasterDao: CompanyMasterDao;
  private sequelizeHandler: SequelizeHandler;
  private dateHandler: DateHandler;

  constructor(
    @inject(types.OpenGraphLogic) openGraphLogic: OpenGraphLogic,
    @inject(types.CompanyMasterDao) companyMasterDao: CompanyMasterDao,
    @inject(types.SequelizeHandler) sequelizeHandler: SequelizeHandler,
    @inject(types.DateHandler) dateHandler: DateHandler,
  ) {
    this.openGraphLogic = openGraphLogic;
    this.companyMasterDao = companyMasterDao;
    this.sequelizeHandler = sequelizeHandler;
    this.dateHandler = dateHandler;
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

  public async save(
    parameter: SharedPostPostParameter,
  ): Promise<SharedPostPostResponse> {
    const posts = parameter.posts;
    const response: SharedPostPostResponse = { posts: [] };
    await this.sequelizeHandler.transact(async (transaction) => {
      // 会社マスタ更新
      // ホームページURLや会社名変更対応できるように、投稿ごとに書き換える
      // TODO:将来的には複数件一括でupsertしたい
      await Promise.all(
        posts.map(async (post) => {
          await this.companyMasterDao.upsertCompany(
            {
              companyNumber: post.companyNumber,
              companyName: post.companyName,
              homepageUrl: post.companyHomepageUrl,
            },
            transaction,
          );
        }),
      );

      // TODO:投稿・投稿詳細への書き込み
      // 投稿詳細は、送られたもののみを残すため、delete→insertで更新
      response.posts = await Promise.all(
        posts.map<SharedPostPostResponseItem>((post) => {
          const currentDate = this.dateHandler.getCurrentDate();
          const joinedDateTimeString =
            `${currentDate.getFullYear()}${currentDate.getMonth()}${currentDate.getDate()}` +
            `${currentDate.getHours()}${currentDate.getMinutes()}${currentDate.getSeconds()}${currentDate.getMilliseconds()}`;
          const postId = `${post.companyNumber}${parameter.userId}${joinedDateTimeString}`;
          const details = post.postDetails;

          const postDetails = details.map<SharedPostDetailResponse>(
            (detail, index) => {
              return { key: detail.key, id: index };
            },
          );

          return { key: post.key, id: postId, updatedAt: '', postDetails };
        }),
      );

      transaction.commit();
    });

    return response;
  }
}
