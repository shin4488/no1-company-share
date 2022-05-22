export interface SharedPostPostResponseItem {
  key: string | null;
  id: string;
  updatedAt: string;
}

export interface SharedPostPostResponse {
  posts: SharedPostPostResponseItem[];
}
