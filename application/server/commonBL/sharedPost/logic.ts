import { inject, injectable } from 'inversify';
import { SharedPostParameterDto } from '../dao/sharedPost/definition/sharedPostParameterDto';
import {
  SharedPostLogicResultItem,
  SharedPostLogicResultItemDetail,
} from './definition/SharedPostLogicResult';
import { SharedPostLogic } from './interface/logic';
import { SharedPostDao } from '@s/commonBL/dao/sharedPost/interface/dao';
import { types } from '@s/common/dependencyInjection/types';
import { StringUtil } from '@c/util/stringUtil';
import { ArrayUtil } from '@c/util/arrayUtil';
import Bookmark from '@s/common/sequelize/models/bookmark';
import SharedPostDetail from '@s/common/sequelize/models/sharedPostDetail';

@injectable()
export class SharedPostLogicImpl implements SharedPostLogic {
  private sharedPostDao: SharedPostDao;

  constructor(@inject(types.SharedPostDao) sharedPostDao: SharedPostDao) {
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
        const bookmarkUsers = bookmarks?.map((x) => x.userId);
        const bookmarksTotalCount = post.BookmarksTotalCount;
        const userMaster = post.UserMaster;
        const companyMaster = post.CompanyMaster;
        const sharedPostResult: SharedPostLogicResultItem = {
          id: post.id,
          companyNumber: post.companyNumber,
          companyName: StringUtil.ifEmpty(companyMaster?.companyJapaneseName),
          companyHomepageUrl: StringUtil.ifEmpty(companyMaster?.homepageUrl),
          companyImageUrl: StringUtil.ifEmpty(companyMaster?.imageUrl),
          postingUserId: post.userId,
          postingUserName: StringUtil.ifEmpty(userMaster?.displayedName),
          postingUserIcomImageUrl: StringUtil.ifEmpty(userMaster?.iconImageUrl),
          isBookmarkedByLoginUser:
            bookmarkUsers?.includes(parameter.userId) || false,
          numberOfBookmarks: ArrayUtil.isEmpty(bookmarksTotalCount)
            ? 0
            : (bookmarksTotalCount as Bookmark[]).length,
          remarks: post.remarks,
          updatedAt: post.updatedAt.toISOString(),
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

    return responsePosts;
  }
}
