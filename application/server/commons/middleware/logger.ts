import express from 'express';
import { systemLogger } from '@s/commons/logger/logHandler';

export const logRequestResponse = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) => {
  systemLogger.info(request.method);
  systemLogger.info(request.hostname);
  systemLogger.info(request.url);
  systemLogger.info(request.headers);
  systemLogger.info(request.params);
  systemLogger.info(request.query);
  systemLogger.info(request.body);
  systemLogger.info(response.getHeaders());
  systemLogger.info(response.statusCode);
  next();
};
