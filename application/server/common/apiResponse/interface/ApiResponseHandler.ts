import { ApiResponseSpec } from '../definition/apiResponseSpec';

export interface ApiResponseHandler {
  createResponse<TResponse = unknown>(
    data?: TResponse,
  ): ApiResponseSpec<TResponse>;
  addErrorMessages(...messages: string[]): void;
}
