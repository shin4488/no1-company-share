import { inject, injectable } from 'inversify';
import { CompanyLogic } from './interface/logic';
import { CompanyListGetResponse } from './definition/companyGetResponse';
import { CompanyResponseCreationParameterItem } from './definition/companyResponseCreationParameter';
import { types } from '@s/common/dependencyInjection/types';
import { SharedPostDao } from '@s/commonBL/dao/sharedPost/interface/dao';

@injectable()
export class CompanyLogicImpl implements CompanyLogic {
  private sharedPostDao: SharedPostDao;

  constructor(@inject(types.SharedPostDao) sharedPostDao: SharedPostDao) {
    this.sharedPostDao = sharedPostDao;
  }

  public async createCompanyResponseByFetchingCompanyMaster(
    parameters: CompanyResponseCreationParameterItem[],
  ): Promise<CompanyListGetResponse[]> {
    const companyNumberList = parameters.map((x) => x.companyNumber);
    // 法人番号は重複しない想定であるため、SetにせずListのまま検索
    const existingCompanies =
      await this.sharedPostDao.getNonReportedAliveByCompanyNumbers(
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
