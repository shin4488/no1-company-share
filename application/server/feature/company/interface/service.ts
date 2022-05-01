import { CompanyGetParameter } from '../definition/companyGetParameter';
import { CompanyGetResponse } from '../definition/companyGetResponse';

export interface CompanyService {
  getCompanies(parameter: CompanyGetParameter): Promise<CompanyGetResponse>;
}
