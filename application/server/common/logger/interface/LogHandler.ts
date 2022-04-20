import { Level } from 'log4js';
import express from 'express';

export interface LogHandler {
  /**
   * ログファイルへの出力
   * エラーログはerrorメソッドを使用してください。
   * @param level
   * @param args
   */
  log(level: Level | 'trace' | 'debug' | 'info' | 'warn', ...args: any[]): void;
  error(message: any, ...args: any[]): void;
  getAccessLoggerMiddleware(): express.Handler;
}
