import * as path from 'path';
import express from 'express';
import log4js, { getLogger, connectLogger, configure } from 'log4js';

class LogHandler {
  private static _systemLogger: log4js.Logger;
  private static _errorLogger: log4js.Logger;
  private static _accessLogger: log4js.Logger;

  get systemLogger(): log4js.Logger {
    return LogHandler._systemLogger;
  }

  get errorLogger(): log4js.Logger {
    return LogHandler._errorLogger;
  }

  constructor() {
    if (!this.shouldInitialize()) {
      return;
    }

    // https://github.com/log4js-node/log4js-node/tree/master/docs
    const configPath = path.resolve(__dirname, 'config.json');
    configure(configPath);
    LogHandler._systemLogger = getLogger('system');
    LogHandler._errorLogger = getLogger('error');
    LogHandler._accessLogger = getLogger('access');
  }

  getAccessLoggerMiddleware(): express.Handler {
    const accessLoggerMiddleware: express.Handler = connectLogger(
      LogHandler._accessLogger,
      {},
    );
    return accessLoggerMiddleware;
  }

  private shouldInitialize(): boolean {
    return (
      LogHandler._systemLogger === undefined ||
      LogHandler._errorLogger === undefined ||
      LogHandler._accessLogger === undefined
    );
  }
}

const logInstance: LogHandler = new LogHandler();
const systemLogger = logInstance.systemLogger;
const errorLogger = logInstance.errorLogger;
const accessLoggerMiddleware = logInstance.getAccessLoggerMiddleware();

export { systemLogger, errorLogger, accessLoggerMiddleware };
