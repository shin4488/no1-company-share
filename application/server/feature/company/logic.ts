import axios from 'axios';
import { inject, injectable } from 'inversify';
import { CompanyGetParameter } from './definition/companyGetParameter';
import { GbizCompanyRequest } from './definition/externalApiSpec/gbizCompanyRequest';
import {
  GbizCompanyResponse,
  GbizCompanyResponseItem,
} from './definition/externalApiSpec/gbizCompanyResponse';
import { CompanyLogic } from './interface/logic';
import { CompanyListGetResponse } from './definition/companyGetResponse';
import { StringUtil } from '@c/util/stringUtil';
import { types } from '@s/common/dependencyInjection/types';
import { CompanyMasterDao } from '@s/commonBL/dao/company/interface/dao';

@injectable()
export class CompanyLogicImpl implements CompanyLogic {
  private companyDao: CompanyMasterDao;

  constructor(@inject(types.CompanyMasterDao) companyDao: CompanyMasterDao) {
    this.companyDao = companyDao;
  }

  public async sendCompanyRequest(
    parameter: CompanyGetParameter,
  ): Promise<GbizCompanyResponseItem[] | undefined> {
    const gbizReuqestQuery: GbizCompanyRequest = {
      name: parameter.companyName,
      // 「JIS X 0401都道府県コード」の「18」は「福井県」
      prefecture: '18',
      page: 1,
      limit: 70,
    };
    const gbizRequestHeader: Record<string, string> = {
      'X-hojinInfo-api-token': StringUtil.ifEmpty(process.env.GBIZ_API_KEY),
    };

    let companyDataList: GbizCompanyResponseItem[] | undefined = [];
    try {
      const companyResult = await axios.get<GbizCompanyResponse>(
        'https://info.gbiz.go.jp/hojin/v1/hojin',
        {
          headers: gbizRequestHeader,
          params: gbizReuqestQuery,
        },
      );
      const companyResultData = companyResult.data;
      companyDataList = companyResultData['hojin-infos'];
    } catch {
      // APIコールアウト時のエラーはこのサーバ上ではエラーとして扱わないためcatchする
    }

    return companyDataList;
  }

  public async createCompanyResponseByFetchingCompanyMaster(
    castedCompanyDataList: GbizCompanyResponseItem[],
  ): Promise<CompanyListGetResponse[]> {
    const companyNumberList = castedCompanyDataList.map(
      (x) => x.corporate_number,
    );
    const existingCompanies = await this.companyDao.getCompaniesByNumber(
      companyNumberList,
    );
    const existingCompanyNumbers = existingCompanies.map(
      (x) => x.companyNumber,
    );

    return castedCompanyDataList.map<CompanyListGetResponse>((x) => ({
      number: x.corporate_number,
      name: x.name,
      isRegistered: existingCompanyNumbers.includes(x.corporate_number),
    }));
  }
}
