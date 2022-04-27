/**
 * APIレスポンスのメッセージ
 */
export interface ApiResponseMessage {
  message: string;
}

/**
 * APIレスポンスの共通部分
 */
export interface ApiResponse<TReponse = unknown> {
  messages: ApiResponseMessage[];
  data: TReponse | null;
}
