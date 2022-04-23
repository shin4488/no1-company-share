/**
 * レスポンスのエラーメッセージ
 */
export interface AppMessageResponse {
  message: string;
}

/**
 * レスポンスのデータ
 */
export interface AppResponse<T = {}> {
  messages: AppMessageResponse[] | [];
  data: T | null;
}
