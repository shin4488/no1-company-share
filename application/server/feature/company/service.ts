import { inject, injectable } from 'inversify';
import { CompanyGetParameter } from './definition/companyGetParameter';
import { CompanyGetResponse } from './definition/companyGetResponse';
import { CompanyService } from './interface/service';
import { CompanyLogic } from './interface/logic';
import { CompanyResponseCreationParameterItem } from './definition/companyResponseCreationParameter';
import { ArrayUtil } from '@c/util/arrayUtil';
import { types } from '@s/common/dependencyInjection/types';
import { ExternalCompanyLogic } from '@s/commonBL/externalCompany/interface/logic';
import { ExternalCompanyParameter } from '@s/commonBL/externalCompany/definition/externalCompanyParameter';

@injectable()
export class CompanyServiceImpl implements CompanyService {
  private logic: CompanyLogic;
  private externalCompanyLogic: ExternalCompanyLogic;

  constructor(
    @inject(types.CompanyLogic) logic: CompanyLogic,
    @inject(types.ExternalCompanyLogic)
    externalCompanyLogic: ExternalCompanyLogic,
  ) {
    this.logic = logic;
    this.externalCompanyLogic = externalCompanyLogic;
  }

  public async getCompanies(
    parameter: CompanyGetParameter,
  ): Promise<CompanyGetResponse> {
    const externalCompanyParameter: ExternalCompanyParameter = {
      companyName: parameter.companyName,
      limit: 40,
    };
    const companyResult = await this.externalCompanyLogic.getExternalCompany(
      externalCompanyParameter,
    );
    const companyResultItems = companyResult.companies;
    if (ArrayUtil.isEmpty(companyResultItems)) {
      return {
        companies: [],
      };
    }

    // この時点では会社リストはundefinedにはなり得ない
    const responseCreationParameters =
      companyResultItems.map<CompanyResponseCreationParameterItem>((x) => ({
        companyNumber: x.companyNumber,
        japaneseName: x.japaneseName,
        englishName: x.englishName,
      }));
    const companiesResponse =
      await this.logic.createCompanyResponseByFetchingCompanyMaster(
        responseCreationParameters,
      );
    return {
      companies: companiesResponse,
    };
  }
}
