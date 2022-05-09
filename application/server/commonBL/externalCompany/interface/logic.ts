import { ExternalCompanyParameter } from '../definition/externalCompanyParameter';
import { ExternalCompanyResult } from '../definition/externalCompanyResult';

export interface ExternalCompanyLogic {
  getExternalCompany(
    parameter: ExternalCompanyParameter,
  ): Promise<ExternalCompanyResult>;
}
