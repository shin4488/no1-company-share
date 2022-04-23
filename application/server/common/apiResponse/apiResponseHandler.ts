import { injectable } from 'inversify';
import {
  ApiResponseSpec,
  ApiResponseMessage,
} from './definition/apiResponseSpec';
import { ApiResponseHandler } from './interface/ApiResponseHandler';

@injectable()
export class ApiResponseHandlerImpl implements ApiResponseHandler {
  private actionMessages: ApiResponseMessage[] = [];

  createResponse<TResponse = unknown>(
    data?: TResponse,
  ): ApiResponseSpec<TResponse> {
    const hasErrorMessage = this.actionMessages.length !== 0;
    if (hasErrorMessage) {
      return {
        messages: this.actionMessages,
        data: null,
      };
    }

    return {
      messages: [],
      data: data || null,
    };
  }

  addErrorMessages(...messages: string[]): void {
    messages.forEach((x) => {
      this.actionMessages.push({
        message: x,
      });
    });
  }
}
