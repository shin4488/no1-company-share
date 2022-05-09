export interface SharedPostPostResponseItem {
  id: string | null;
  updatedAt: string | null;
}

export interface SharedPostPostResponse {
  posts: SharedPostPostResponseItem[];
}
