export interface SharedPostDetailResponse {
  key: string | null;
  id: number;
}

export interface SharedPostPostResponseItem {
  key: string | null;
  id: string;
  updatedAt: string;
  postDetails: SharedPostDetailResponse[];
}

export interface SharedPostPostResponse {
  posts: SharedPostPostResponseItem[];
}
