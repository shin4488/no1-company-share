import { SharedPost } from '@f/definition/common/sharedPost';
import { SelectItem } from '@f/definition/common/selectItem';

export interface HomePageData {
  sharedPosts: SharedPost[];
  no1Divisions: SelectItem[];
  isLoadMoreButtonShown: boolean;
  oldBaseDateTime: string | null;
}
