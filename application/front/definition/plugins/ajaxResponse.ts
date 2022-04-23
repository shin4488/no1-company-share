/**
 * レスポンスのエラーメッセージ
 */
export interface AppResponseMessage {
  message: string;
}

/**
 * レスポンスのデータ
 */
export interface AppResponse<T = {}> {
  messages: AppResponseMessage[] | [];
  data: T | null;
}
