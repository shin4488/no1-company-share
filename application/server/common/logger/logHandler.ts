import * as path from 'path';
import express from 'express';
import { injectable } from 'inversify';
import log4js, { Level, getLogger, connectLogger, configure } from 'log4js';
import { LogHandler } from './interface/LogHandler';

@injectable()
export class LogHandlerImpl implements LogHandler {
  private systemLogger: log4js.Logger;
  private errorLogger: log4js.Logger;
  private accessLogger: log4js.Logger;

  constructor() {
    // https://github.com/log4js-node/log4js-node/tree/master/docs
    const configPath = path.resolve(__dirname, 'config.json');
    configure(configPath);
    this.systemLogger = getLogger('system');
    this.errorLogger = getLogger('error');
    this.accessLogger = getLogger('access');
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
    const accessLoggerMiddleware: express.Handler = connectLogger(
      this.accessLogger,
      {},
    );
    return accessLoggerMiddleware;
  }
}
