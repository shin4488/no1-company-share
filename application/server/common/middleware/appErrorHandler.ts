import express from 'express';
import { AppError } from '@s/common/error/appError';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { LogHandler } from '@s/common/logger/interface/LogHandler';

export const catchError = (
  error: Error,
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) => {
  const logger = appContainer.get<LogHandler>(types.LogHandler);
  logger.error(error);

  // 例外発生時にステータスコードがセットされている場合は、セットされたステータスコードを使用
  const statusCode =
    error instanceof AppError && error.statusCode !== undefined
      ? error.statusCode
      : 500;
  const expressResponse = response.status(statusCode);
  // TODO:例外メッセージの返却方法（レスポンスのデータ構造の考慮）が必要
  expressResponse.send(error.message);
};
