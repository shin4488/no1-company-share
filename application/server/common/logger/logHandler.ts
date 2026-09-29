/* eslint-disable import/no-named-as-default-member -- log4js is CommonJS and its named imports fail in the Nitro ESM bundle. */
import express from 'express';
import { injectable } from 'inversify';
import log4js, { type Level } from 'log4js';
import config from './config.json';
import { LogHandler } from './interface/LogHandler';

@injectable()
export class LogHandlerImpl implements LogHandler {
  private systemLogger: log4js.Logger;
  private errorLogger: log4js.Logger;
  private accessLogger: log4js.Logger;

  constructor() {
    // https://github.com/log4js-node/log4js-node/tree/master/docs
    log4js.configure(config as log4js.Configuration);
    this.systemLogger = log4js.getLogger('system');
    this.errorLogger = log4js.getLogger('error');
    this.accessLogger = log4js.getLogger('access');
  }

  log(
    level: Level | 'trace' | 'debug' | 'info' | 'warn',
    ...argments: any[]
  ): void {
    this.systemLogger.log(level, argments);
  }

  error(message: any, ...argments: any[]): void {
    this.errorLogger.error(message, argments);
  }

  getAccessLoggerMiddleware(): express.Handler {
    const accessLoggerMiddleware: express.Handler = log4js.connectLogger(
      this.accessLogger,
      {},
    );
    return accessLoggerMiddleware;
  }
}
