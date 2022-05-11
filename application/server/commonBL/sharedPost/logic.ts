import { inject, injectable } from 'inversify';
import { SharedPostParameterDto } from '../dao/sharedPost/definition/sharedPostParameterDto';
import {
  SharedPostLogicResultItem,
  SharedPostLogicResultItemDetail,
} from './definition/SharedPostLogicResult';
import { SharedPostLogic } from './interface/logic';
import { SharedPostDao } from '@s/commonBL/dao/sharedPost/interface/dao';
import { types } from '@s/common/dependencyInjection/types';
import { OpenGraphType } from '@s/commonBL/openGraph/definition/openGraphType';
import { OpenGraphLogic } from '@s/commonBL/openGraph/interface/logic';
import { StringUtil } from '@c/util/stringUtil';
import { ArrayUtil } from '@c/util/arrayUtil';
import Bookmark from '@s/common/sequelize/models/bookmark';
import SharedPostDetail from '@s/common/sequelize/models/sharedPostDetail';

@injectable()
export class SharedPostLogicImpl implements SharedPostLogic {
  private openGraphLogic: OpenGraphLogic;
  private sharedPostDao: SharedPostDao;

  constructor(
    @inject(types.OpenGraphLogic) openGraphLogic: OpenGraphLogic,
    @inject(types.SharedPostDao) sharedPostDao: SharedPostDao,
  ) {
    this.openGraphLogic = openGraphLogic;
    this.sharedPostDao = sharedPostDao;
  }

  public async getSharedPosts(
    parameter: SharedPostParameterDto,
  ): Promise<SharedPostLogicResultItem[]> {
    const sharedPostResultDtos =
      await this.sharedPostDao.getSharedPostWithDetails(parameter);
    // 投稿テーブルのデータからレスポンスデータ作成
    const responsePosts = sharedPostResultDtos.map<SharedPostLogicResultItem>(
      (post) => {
        const sharedPostDetails = post.SharedPostDetails;
        const bookmarks = post.Bookmarks;
        const userMaster = post.UserMaster;
        const companyMaster = post.CompanyMaster;
        const sharedPostResult: SharedPostLogicResultItem = {
          id: post.id,
          companyNumber: post.companyNumber,
          companyName: StringUtil.ifEmpty(companyMaster?.companyJapaneseName),
          companyHomepageUrl: StringUtil.ifEmpty(companyMaster?.homepageUrl),
          companyImageUrl: '',
          postingUserId: post.userId,
          postingUserName: StringUtil.ifEmpty(userMaster?.displayedName),
          postingUserIcomImageUrl: StringUtil.ifEmpty(userMaster?.iconImageUrl),
          // TODO:ログインユーザのBookmarkの存在チェック
          isBookmarkedByLoginUser: false,
          numberOfBookmarks: ArrayUtil.isEmpty(bookmarks)
            ? 0
            : (bookmarks as Bookmark[]).length,
          remarks: post.remarks,
          updatedAt: post.updatedAt.toString(),
          postDetails: ArrayUtil.isEmpty(sharedPostDetails)
            ? []
            : (
                sharedPostDetails as SharedPostDetail[]
              ).map<SharedPostLogicResultItemDetail>((detail) => ({
                id: detail.id,
                no1Content: detail.no1Content,
                no1Division: StringUtil.toString(detail.no1Division),
              })),
        };

        return sharedPostResult;
      },
    );
    console.log(responsePosts);

    // #region sampleData
    // const responsePosts: SharedPostLogicResultItem[] = [
    //   {
    //     id: 'testpost1',
    //     companyNumber: 'testcompany1',
    //     companyName: 'テスト株式会社1',
    //     companyHomepageUrl:
    //       'https://zenn.dev/littleforest/articles/scrape-og-tags',
    //     companyImageUrl: '',
    //     postingUserId: '0yC8iU1797VrDALJsG4siIU6C382',
    //     postingUserName: 'S. U.',
    //     postingUserIcomImageUrl:
    //       'https://lh3.googleusercontent.com/a/AATXAJyZSD8UjGl1eF9s-OtXTO6uECzHcMZ0y5HtO1Ei=s96-c',
    //     isBookmarkedByLoginUser: false,
    //     numberOfBookmarks: 4321,
    //     remarks: '2020年度3月期有価証券報告書',
    //     updatedAt: '2022-05-03T03:19:17.238Z',
    //     postDetails: [
    //       {
    //         id: 1,
    //         no1Content: '何かを作ること',
    //         no1Division: '1',
    //       },
    //     ],
    //   },
    //   {
    //     id: 'testpost2',
    //     companyNumber: 'testcompany2',
    //     companyName: 'qwertyuiop asdfghjkl zxcvbnm qwertyuiop',
    //     companyHomepageUrl: 'http://example.com/',
    //     companyImageUrl: '',
    //     postingUserId: 'testuser1',
    //     postingUserName: 'abcdefghijklmn opqrstu vvvvvvv',
    //     postingUserIcomImageUrl:
    //       'https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg',
    //     isBookmarkedByLoginUser: true,
    //     numberOfBookmarks: 999,
    //     remarks:
    //       'http://example.com/ 2020年度3月期有価証券報告書テストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテストテスト',
    //     updatedAt: '2022-05-02T03:19:17.238Z',
    //     postDetails: [
    //       {
    //         id: 1,
    //         no1Content:
    //           'テストテストテストテストテストテストテストテストテストテストテストテスト',
    //         no1Division: '1',
    //       },
    //       {
    //         id: 2,
    //         no1Content: 'テストテストテスト',
    //         no1Division: '2',
    //       },
    //     ],
    //   },
    //   {
    //     id: 'testpost3',
    //     companyNumber: 'testcompany3',
    //     companyName: 'テスト株式会社テスト株式会社テスト株式会社3',
    //     companyHomepageUrl: 'aaa',
    //     companyImageUrl: '',
    //     postingUserId: 'testuser1',
    //     postingUserName: '山田太郎',
    //     postingUserIcomImageUrl:
    //       'https://cdn.pixabay.com/photo/2020/06/24/19/12/cabbage-5337431_1280.jpg',
    //     isBookmarkedByLoginUser: false,
    //     numberOfBookmarks: 0,
    //     remarks: '',
    //     updatedAt: '2022-05-01T03:19:17.238Z',
    //     postDetails: [
    //       {
    //         id: 1,
    //         no1Content: 'テストテストテスト',
    //         no1Division: '1',
    //       },
    //     ],
    //   },
    //   {
    //     id: 'testpost4',
    //     companyNumber: 'testcompany4',
    //     companyName: 'テスト株式会社4',
    //     companyHomepageUrl:
    //       'https://ja.wikipedia.org/wiki/%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%9A%E3%83%BC%E3%82%B8',
    //     companyImageUrl: '',
    //     postingUserId: '0yC8iU1797VrDALJsG4siIU6C382',
    //     postingUserName: 'abcdefghijklmn opqrstu vvvvvvv',
    //     postingUserIcomImageUrl:
    //       'https://lh3.googleusercontent.com/a/AATXAJyZSD8UjGl1eF9s-OtXTO6uECzHcMZ0y5HtO1Ei=s96-c',
    //     isBookmarkedByLoginUser: true,
    //     numberOfBookmarks: 1000,
    //     remarks: '2020年度3月期有価証券報告書',
    //     updatedAt: '2022-05-01T00:19:17.238Z',
    //     postDetails: [
    //       {
    //         id: 1,
    //         no1Content: 'qwertyuiop asdfghjkl zxcvbnm qwertyuiop',
    //         no1Division: '1',
    //       },
    //       {
    //         id: 2,
    //         no1Content: "<script>alert('okok')</script>",
    //         no1Division: '1',
    //       },
    //     ],
    //   },
    //   {
    //     id: 'testpost5',
    //     companyNumber: 'testcompany5',
    //     companyName: 'テスト株式会社5',
    //     companyHomepageUrl: '',
    //     companyImageUrl: '',
    //     postingUserId: '0yC8iU1797VrDALJsG4siIU6C382',
    //     postingUserName: 'あいうえおかきくけこさしすせそたちつてと',
    //     postingUserIcomImageUrl:
    //       'https://lh3.googleusercontent.com/a/AATXAJyZSD8UjGl1eF9s-OtXTO6uECzHcMZ0y5HtO1Ei=s96-c',
    //     isBookmarkedByLoginUser: true,
    //     numberOfBookmarks: 100500,
    //     remarks: '2020年度3月期有価証券報告書\nテスト改行',
    //     updatedAt: '2022-04-11 10:30:59.999',
    //     postDetails: [
    //       {
    //         id: 1,
    //         no1Content: 'qwertyuiop asdfghjkl zxcvbnm qwertyuiop',
    //         no1Division: '1',
    //       },
    //       {
    //         id: 2,
    //         no1Content: "<script>alert('okok')</script>",
    //         no1Division: '1',
    //       },
    //     ],
    //   },
    // ];
    // #endregion

    // 会社ホームページURLからOG画像取得
    const responsePostsWithCompanyUrl = await Promise.all(
      responsePosts.map(async (post) => {
        const ogResult = await this.openGraphLogic.getOpenGraph(
          post.companyHomepageUrl,
          [OpenGraphType.IMAGE],
        );
        post.companyImageUrl = ogResult.image;
        return post;
      }),
    );

    return responsePostsWithCompanyUrl;
  }
}
