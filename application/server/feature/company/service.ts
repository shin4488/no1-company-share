import { inject, injectable } from 'inversify';
import { CompanyGetParameter } from './definition/companyGetParameter';
import { CompanyGetResponse } from './definition/companyGetResponse';
import { GbizCompanyResponseItem } from './definition/externalApiSpec/gbizCompanyResponse';
import { CompanyService } from './interface/service';
import { CompanyLogic } from './interface/logic';
import { ArrayUtil } from '@c/util/arrayUtil';
import { types } from '@s/common/dependencyInjection/types';

@injectable()
export class CompanyServiceImpl implements CompanyService {
  private logic: CompanyLogic;

  constructor(@inject(types.CompanyLogic) logic: CompanyLogic) {
    this.logic = logic;
  }

  public async getCompanies(
    parameter: CompanyGetParameter,
  ): Promise<CompanyGetResponse> {
    const companyDataList = await this.logic.sendCompanyRequest(parameter);
    if (ArrayUtil.isEmpty(companyDataList)) {
      return {
        companies: [],
      };
    }

    const castedCompanyDataList = companyDataList as GbizCompanyResponseItem[];
    // この時点では会社リストはundefinedにはなり得ない
    const companiesResponse =
      await this.logic.createCompanyResponseByFetchingCompanyMaster(
        castedCompanyDataList,
      );
    return {
      companies: companiesResponse,
    };
  }
}
