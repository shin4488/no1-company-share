import { injectable } from 'inversify';
import {
  ApiResponseSpec,
  ApiResponseMessage,
} from './definition/apiResponseSpec';
import { ApiResponseHandler } from './interface/apiResponseHandler';
import { ArrayUtil } from '@c/util/arrayUtil';

@injectable()
export class ApiResponseHandlerImpl implements ApiResponseHandler {
  private actionMessages: ApiResponseMessage[] = [];

  createResponse<TResponse = unknown>(
    data?: TResponse,
  ): ApiResponseSpec<TResponse> {
    if (ArrayUtil.isNotEmpty(this.actionMessages)) {
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
