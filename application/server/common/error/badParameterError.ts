import { AppError } from './appError';
import { ArrayUtil } from '@c/util/arrayUtil';

/**
 * リクエストパラメータが不正である時の例外
 */
export class BadParameterError extends AppError {
  constructor(...messages: string[]) {
    const errorMessages = ArrayUtil.isNotEmpty(messages)
      ? messages
      : ['データが存在しません。'];
    super(...errorMessages);
  }
}
