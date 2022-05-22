import express from 'express';
import { AppError } from '@s/common/error/appError';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { LogHandler } from '@s/common/logger/interface/LogHandler';
import { ApiResponseHandler } from '@s/common/apiResponse/interface/apiResponseHandler';
import { NotAuthorizedError } from '@s/common/error/notAuthorizedError';
import { RecordNotFoundError } from '@s/common/error/recordNotFoundError';

export const catchError = (
  error: Error,
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) => {
  const logger = appContainer.get<LogHandler>(types.LogHandler);
  logger.error(error);

  const appErrorInstance = error instanceof AppError;
  const statusCode =
    error instanceof NotAuthorizedError
      ? 401
      : error instanceof RecordNotFoundError
      ? 404
      : // badParameter系は400として処理
      appErrorInstance
      ? 400
      : 500;
  const expressResponse = response.status(statusCode);
  const responseHandler = appContainer.get<ApiResponseHandler>(
    types.ApiResponseHandler,
  );
  if (appErrorInstance) {
    const errorMessages = (error as AppError).errorMessages;
    responseHandler.addErrorMessages(...errorMessages);
  } else {
    // アプリ側で意図的に発生させた例外以外は、セキュリティのため詳細なエラーメッセージを返さない
    responseHandler.addErrorMessages(`${statusCode} : Server Error`);
  }

  expressResponse.send(responseHandler.createResponse());
};
