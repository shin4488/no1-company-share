/**
 * APIレスポンスのメッセージ
 */
export interface ApiResponseMessage {
  message: string;
}

/**
 * APIレスポンスの共通部分
 */
export interface ApiResponseSpec<TReponse = unknown> {
  messages: ApiResponseMessage[] | [];
  data: TReponse | null;
}
