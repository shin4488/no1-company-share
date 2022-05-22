import express from 'express';
import { ApiResponseHandler } from '@s/common/apiResponse/interface/apiResponseHandler';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';

/**
 * このアプリの基底となるコントローラクラス
 */
export class BaseController {
  /**
   * 成功のAPIレスポンス返却
   * @param response
   * @param data
   */
  public static success<TResponse>(
    response: express.Response,
    data?: TResponse,
  ) {
    const responseHandler = appContainer.get<ApiResponseHandler>(
      types.ApiResponseHandler,
    );
    const responseBody = responseHandler.createResponse(data);
    response.send(responseBody);
  }
}
