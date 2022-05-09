import { CompanyListGetResponse } from '../definition/companyGetResponse';
import { CompanyResponseCreationParameterItem } from '../definition/companyResponseCreationParameter';

export interface CompanyLogic {
  createCompanyResponseByFetchingCompanyMaster(
    parameters: CompanyResponseCreationParameterItem[],
  ): Promise<CompanyListGetResponse[]>;
}
