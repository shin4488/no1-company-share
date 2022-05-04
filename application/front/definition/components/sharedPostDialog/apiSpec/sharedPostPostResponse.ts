export interface SharedPostDetailResponse {
  key: string | null;
  id: number | null;
}

export interface SharedPostPostResponseItem {
  id: string | null;
  updatedAt: string | null;
  postDetails: SharedPostDetailResponse[];
}

export interface SharedPostPostResponse {
  posts: SharedPostPostResponseItem[];
}
