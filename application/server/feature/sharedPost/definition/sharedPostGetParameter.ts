export interface SharedPostGetParameter {
  limit: number;
  /**
   * 取得基準日時
   * nullのときは更新日時で絞り込まない
   */
  baseDateTime: Date | null;
  isMyPostOnly: boolean;
  postId: string;
  userId: string;
}
