import { SharedPostPostParameter } from '../definition/sharedPostPostParameter';
import { SharedPostPutParameter } from '../definition/sharedPostPutParameter';

export interface SharedPostComplexValidator {
  validateForInsert(parameter: SharedPostPostParameter): Promise<void>;
  validateForUpdate(parameter: SharedPostPutParameter): Promise<void>;
}
