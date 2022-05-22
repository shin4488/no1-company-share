import { BookmarkDeleteParameter } from '../definition/bookmarkDeleteParameter';
import { BookmarkPostParameter } from '../definition/bookmarkPostParameter';

export interface BookmarkComplexValidator {
  validateForPostNewBookmarks(parameter: BookmarkPostParameter): Promise<void>;
  validateForDeleteBookmarks(parameter: BookmarkDeleteParameter): Promise<void>;
}
