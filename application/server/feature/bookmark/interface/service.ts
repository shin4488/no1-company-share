import { BookmarkDeleteParameter } from '../definition/bookmarkDeleteParameter';
import { BookmarkGetParameter } from '../definition/bookmarkGetParameter';
import { BookmarkGetResponse } from '../definition/bookmarkGetResponse';
import { BookmarkPostParameter } from '../definition/bookmarkPostParameter';

export interface BookmarkService {
  getBookmarks(parameter: BookmarkGetParameter): Promise<BookmarkGetResponse>;
  postNewBookmarks(parameter: BookmarkPostParameter): Promise<void>;
  deleteBookmarks(parameter: BookmarkDeleteParameter): Promise<void>;
}
