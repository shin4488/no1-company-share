export interface SharedPostParameterDto {
  postId?: string;
  limit: number;
  userId: string;
  isMyPostOnly: boolean;
  /**
   * 取得基準日時
   * 全取得の場合は、nullとなる
   */
  baseDateTime: Date | null;
}
