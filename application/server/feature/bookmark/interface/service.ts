import { BookmarkDeleteParameter } from '../definition/bookmarkDeleteParameter';
import { BookmarkPostParameter } from '../definition/bookmarkPostParameter';

export interface BookmarkService {
  postNewBookmarks(parameter: BookmarkPostParameter): Promise<void>;
  deleteBookmarks(parameter: BookmarkDeleteParameter): Promise<void>;
}
