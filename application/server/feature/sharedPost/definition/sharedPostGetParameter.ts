export interface SharedPostGetParameter {
  limit: number;
  /**
   * 取得基準日時
   * 全取得の場合は、nullとなる
   */
  baseDateTime: Date | null;
  isMyPostOnly: boolean;
  postId: string;
  userId: string;
}
