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

  logger.log('info', '---request start---');
  logger.log('info', request.method);
  logger.log('info', request.hostname);
  logger.log('info', request.url);
  logger.log('info', 'headers');
  logger.log('info', request.headers);
  logger.log('info', 'params');
  logger.log('info', request.params);
  logger.log('info', 'query');
  logger.log('info', request.query);
  logger.log('info', 'body');
  logger.log('info', request.body);
  logger.log('info', '---request end---');

  next();
};
