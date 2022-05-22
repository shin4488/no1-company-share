export interface BookmarkDeleteParameterItem {
  id: string;
}

export interface BookmarkDeleteParameter {
  userId: string;
  posts: BookmarkDeleteParameterItem[];
}
