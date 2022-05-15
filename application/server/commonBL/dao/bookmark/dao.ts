import { injectable } from 'inversify';
import { Op } from 'sequelize';
import { BookmarkDestroyParameter } from './definition/bookmarkDestroyParameter';
import { BookmarkDao } from './interface/dao';
import Bookmark from '@s/common/sequelize/models/bookmark';

@injectable()
export class BookmarkDaoImpl implements BookmarkDao {
  public async destroyBookmarks(
    parameter: BookmarkDestroyParameter,
  ): Promise<void> {
    await Bookmark.destroy({
      where: {
        userId: parameter.userId,
        sharedPostId: {
          [Op.in]: parameter.sharedPostIds,
        },
      },
    });
  }
}
