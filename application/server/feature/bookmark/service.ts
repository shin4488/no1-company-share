import { inject, injectable } from 'inversify';
import { BookmarkPostParameter } from './definition/bookmarkPostParameter';
import { BookmarkComplexValidator } from './interface/complexValidator';
import { BookmarkService } from './interface/service';
import { BookmarkDeleteParameter } from './definition/bookmarkDeleteParameter';
import { BookmarkGetParameter } from './definition/bookmarkGetParameter';
import { BookmarkGetResponse } from './definition/bookmarkGetResponse';
import { types } from '@s/common/dependencyInjection/types';
import { BookmarkDao } from '@s/commonBL/dao/bookmark/interface/dao';
import { BookmarkDestroyParameter } from '@s/commonBL/dao/bookmark/definition/bookmarkDestroyParameter';
import Bookmark from '@s/common/sequelize/models/bookmark';
import { SequelizeHandler } from '@s/common/sequelize/logic/interface/SequelizeHandler';
import { SharedPostLogic } from '@s/commonBL/sharedPost/interface/logic';
import { SharedPostParameterDto } from '@s/commonBL/dao/sharedPost/definition/sharedPostParameterDto';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';

@injectable()
export class BookmarkServiceImpl implements BookmarkService {
  private complexValidator: BookmarkComplexValidator;
  private sequelizeHandler: SequelizeHandler;
  private bookmarkDao: BookmarkDao;

  constructor(
    @inject(types.BookmarkComplexValidator)
    complexValidator: BookmarkComplexValidator,
    @inject(types.SequelizeHandler) sequelizeHandler: SequelizeHandler,
    @inject(types.BookmarkDao)
    bookmarkDao: BookmarkDao,
  ) {
    this.complexValidator = complexValidator;
    this.sequelizeHandler = sequelizeHandler;
    this.bookmarkDao = bookmarkDao;
  }

  public async getBookmarks(
    parameter: BookmarkGetParameter,
  ): Promise<BookmarkGetResponse> {
    const parameterDto: SharedPostParameterDto = {
      limit: parameter.limit,
      postId: parameter.postId,
      userId: parameter.userId,
      isMyPostOnly: false,
      isMyBookmarkOnly: true,
      baseDateTime: parameter.baseDateTime,
    };
    const logic = appContainer.get<SharedPostLogic>(types.SharedPostLogic);
    const responsePosts = await logic.getSharedPosts(parameterDto);
    const response: BookmarkGetResponse = {
      posts: responsePosts,
    };
    return response;
  }

  public async postNewBookmarks(
    parameter: BookmarkPostParameter,
  ): Promise<void> {
    await this.complexValidator.validateForPostNewBookmarks(parameter);

    await this.sequelizeHandler.transact(async (transaction) => {
      const userId = parameter.userId;
      for (const post of parameter.posts) {
        await Bookmark.create(
          {
            sharedPostId: post.id,
            userId,
          },
          { transaction },
        );
      }

      transaction.commit();
    });
  }

  public async deleteBookmarks(
    parameter: BookmarkDeleteParameter,
  ): Promise<void> {
    await this.complexValidator.validateForDeleteBookmarks(parameter);

    await this.sequelizeHandler.transact(async (transaction) => {
      const sharedPosts = parameter.posts;
      const sharedPostIds = sharedPosts.map((x) => x.id);
      const parameterToDestroy: BookmarkDestroyParameter = {
        userId: parameter.userId,
        sharedPostIds,
      };
      await this.bookmarkDao.destroyBookmarks(parameterToDestroy, transaction);

      transaction.commit();
    });
  }
}
