import { SharedPost } from '@f/definition/common/sharedPost';
import { SelectItem } from '@f/definition/common/selectItem';

export interface HomePageData {
  sharedCompanyPosts: SharedPost[];
  no1Divisions: SelectItem[];
  loadedPage: number;
}
