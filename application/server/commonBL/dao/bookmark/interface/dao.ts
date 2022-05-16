import { Transaction } from 'sequelize';
import { BookmarkDestroyParameter } from '../definition/bookmarkDestroyParameter';

export interface BookmarkDao {
  destroyBookmarks(
    parameter: BookmarkDestroyParameter,
    transaction: Transaction,
  ): Promise<void>;
}
