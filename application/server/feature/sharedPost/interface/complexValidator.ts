import { SharedPostPostParameter } from '../definition/sharedPostPostParameter';
import { SharedPostPutParameter } from '../definition/sharedPostPutParameter';
import { SharedPostDeleteParameter } from '../definition/sharedPostDeleteParameter';
import { ReportPostParameter } from '../definition/reportPostParameter';

export interface SharedPostComplexValidator {
  validateForInsert(parameter: SharedPostPostParameter): Promise<void>;
  validateForUpdate(parameter: SharedPostPutParameter): Promise<void>;
  validateForDelete(parameter: SharedPostDeleteParameter): Promise<void>;
  validateForReport(parameter: ReportPostParameter): Promise<void>;
}
