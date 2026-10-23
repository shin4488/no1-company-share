export interface SharedPostParameterDto {
  postId?: string;
  limit: number;
  userId: string;
  isMyPostOnly: boolean;
  isMyBookmarkOnly: boolean;
  /**
   * 取得基準日時
   * nullのときは更新日時で絞り込まない
   */
  baseDateTime: Date | null;
}
