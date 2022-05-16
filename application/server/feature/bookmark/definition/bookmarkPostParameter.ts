export interface BookmarkPostParameterItem {
  id: string;
}

export interface BookmarkPostParameter {
  userId: string;
  posts: BookmarkPostParameterItem[];
}
