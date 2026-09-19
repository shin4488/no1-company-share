import express from 'express';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { LogHandler } from '@s/common/logger/interface/LogHandler';

export const logRequestResponse = (
  request: express.Request,
  _response: express.Response,
  next: express.NextFunction,
) => {
  const logger = appContainer.get<LogHandler>(types.LogHandler);

  // 認証ヘッダー・Cookie・本文・クエリの値を記録しない。
  logger.log('info', { method: request.method, path: request.path });

  next();
};
