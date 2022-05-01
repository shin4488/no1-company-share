import express from 'express';
import { AppError } from '@s/common/error/appError';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { LogHandler } from '@s/common/logger/interface/LogHandler';
import { ApiResponseHandler } from '@s/common/apiResponse/interface/ApiResponseHandler';
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
    (error as AppError).errorMessages.forEach((message) => {
      responseHandler.addErrorMessages(message);
    });
  } else {
    responseHandler.addErrorMessages(error.message);
  }

  expressResponse.send(responseHandler.createResponse());
};
