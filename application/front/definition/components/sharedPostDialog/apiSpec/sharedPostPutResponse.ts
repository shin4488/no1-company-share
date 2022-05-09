export interface SharedPostPutResponseItem {
  id: string | null;
  updatedAt: string | null;
}

export interface SharedPostPutResponse {
  posts: SharedPostPutResponseItem[];
}
