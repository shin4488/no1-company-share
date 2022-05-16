export interface SharedPostDeleteRequestItem {
  id?: string | null;
}

export interface SharedPostDeleteRequest {
  posts?: SharedPostDeleteRequestItem[] | null;
}

/**
 * 投稿削除リクエストURL内のルートパラメータ
 */
export interface SharedPostDeleteRequestParameter {
  postId?: string;
}
