import { inject, injectable } from 'inversify';
import { CompanyLogic } from './interface/logic';
import { CompanyListGetResponse } from './definition/companyGetResponse';
import { CompanyResponseCreationParameterItem } from './definition/companyResponseCreationParameter';
import { types } from '@s/common/dependencyInjection/types';
import { CompanyMasterDao } from '@s/commonBL/dao/company/interface/dao';

@injectable()
export class CompanyLogicImpl implements CompanyLogic {
  private companyDao: CompanyMasterDao;

  constructor(@inject(types.CompanyMasterDao) companyDao: CompanyMasterDao) {
    this.companyDao = companyDao;
  }

  public async createCompanyResponseByFetchingCompanyMaster(
    parameters: CompanyResponseCreationParameterItem[],
  ): Promise<CompanyListGetResponse[]> {
    const companyNumberList = parameters.map((x) => x.companyNumber);
    // 法人番号は重複しない想定であるため、SetにせずListのまま検索
    const existingCompanies = await this.companyDao.getCompaniesByNumber(
      companyNumberList,
    );
    const existingCompanyNumbers = existingCompanies.map(
      (x) => x.companyNumber,
    );

    return parameters.map<CompanyListGetResponse>((x) => ({
      number: x.companyNumber,
      // TODO:将来的に会社名はユーザの使用言語によって英語・日本語を切り替える
      name: x.japaneseName,
      isRegistered: existingCompanyNumbers.includes(x.companyNumber),
    }));
  }
}
