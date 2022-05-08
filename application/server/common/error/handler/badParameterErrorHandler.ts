import { injectable } from 'inversify';
import { BadParameterError } from '../badParameterError';
import { BadParameterErrorHandler } from './interface/badParameterErrorHandler';
import { StringUtil } from '@c/util/stringUtil';
import { ArrayUtil } from '@c/util/arrayUtil';

@injectable()
export class BadParameterErrorHandlerImpl implements BadParameterErrorHandler {
  private messages: string[];

  constructor();
  constructor(...messages: string[]) {
    this.messages = [];
    if (messages === undefined) {
      return;
    }

    this.messages.push(...messages);
  }

  public addMessage(...messages: string[]): BadParameterErrorHandler {
    this.messages.push(...messages);
    return this;
  }

  public toDistinct(): BadParameterErrorHandler {
    const messageSet = new Set(this.messages);
    this.messages = Array.from(messageSet);
    return this;
  }

  public throwIfHasError() {
    if (ArrayUtil.isEmpty(this.messages)) {
      return;
    }

    const nonEmptyMessages = this.messages.filter((x) =>
      StringUtil.isNotEmpty(x),
    );
    const errorInstance = new BadParameterError(...nonEmptyMessages);
    throw errorInstance;
  }
}
