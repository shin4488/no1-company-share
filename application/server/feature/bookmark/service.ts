import { inject, injectable } from 'inversify';
import { BookmarkPostParameter } from './definition/bookmarkPostParameter';
import { BookmarkComplexValidator } from './interface/complexValidator';
import { BookmarkService } from './interface/service';
import { BookmarkDeleteParameter } from './definition/bookmarkDeleteParameter';
import { types } from '@s/common/dependencyInjection/types';
import { BookmarkDao } from '@s/commonBL/dao/bookmark/interface/dao';
import { BookmarkDestroyParameter } from '@s/commonBL/dao/bookmark/definition/bookmarkDestroyParameter';
import Bookmark from '@s/common/sequelize/models/bookmark';

@injectable()
export class BookmarkServiceImpl implements BookmarkService {
  private complexValidator: BookmarkComplexValidator;
  private bookmarkDao: BookmarkDao;

  constructor(
    @inject(types.BookmarkComplexValidator)
    complexValidator: BookmarkComplexValidator,
    @inject(types.BookmarkDao)
    bookmarkDao: BookmarkDao,
  ) {
    this.complexValidator = complexValidator;
    this.bookmarkDao = bookmarkDao;
  }

  public async postNewBookmarks(
    parameter: BookmarkPostParameter,
  ): Promise<void> {
    await this.complexValidator.validateForPostNewBookmarks(parameter);

    const userId = parameter.userId;
    for (const post of parameter.posts) {
      await Bookmark.create({
        sharedPostId: post.id,
        userId,
      });
    }
  }

  public async deleteBookmarks(
    parameter: BookmarkDeleteParameter,
  ): Promise<void> {
    await this.complexValidator.validateForDeleteBookmarks(parameter);

    const sharedPosts = parameter.posts;
    const sharedPostIds = sharedPosts.map((x) => x.id);
    const parameterToDestroy: BookmarkDestroyParameter = {
      userId: parameter.userId,
      sharedPostIds,
    };
    await this.bookmarkDao.destroyBookmarks(parameterToDestroy);
  }
}
