import { BookmarkDestroyParameter } from '../definition/bookmarkDestroyParameter';

export interface BookmarkDao {
  destroyBookmarks(parameter: BookmarkDestroyParameter): Promise<void>;
}
