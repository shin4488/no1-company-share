import { injectable } from 'inversify';
import { DateHandler } from './interface/dateHandler';

@injectable()
export class DateHandlerImpl implements DateHandler {
  getCurrentDate(): Date {
    return new Date();
  }
}
