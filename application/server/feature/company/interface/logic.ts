import { CompanyGetParameter } from '../definition/companyGetParameter';
import { CompanyListGetResponse } from '../definition/companyGetResponse';
import { GbizCompanyResponseItem } from '../definition/externalApiSpec/gbizCompanyResponse';

export interface CompanyLogic {
  sendCompanyRequest(
    parameter: CompanyGetParameter,
  ): Promise<GbizCompanyResponseItem[] | undefined>;

  createCompanyResponseByFetchingCompanyMaster(
    castedCompanyDataList: GbizCompanyResponseItem[],
  ): Promise<CompanyListGetResponse[]>;
}
