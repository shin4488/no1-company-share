export interface BookmarkDeleteRequestItem {
  id?: string | null;
}

export interface BookmarkDeleteRequest {
  posts?: BookmarkDeleteRequestItem[] | null;
}
