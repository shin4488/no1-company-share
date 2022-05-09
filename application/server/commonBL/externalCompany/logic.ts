import axios from 'axios';
import { injectable } from 'inversify';
import { GbizCompanyRequest } from './definition/apiSpec/gbizCompanyRequest';
import { ExternalCompanyParameter } from './definition/externalCompanyParameter';
import {
  ExternalCompanyResult,
  ExternalCompanyResultItem,
} from './definition/externalCompanyResult';
import { ExternalCompanyLogic } from './interface/logic';
import {
  GbizCompanyResponse,
  GbizCompanyResponseItem,
} from './definition/apiSpec/gbizCompanyResponse';
import { StringUtil } from '@c/util/stringUtil';

@injectable()
export class ExternalCompanyLogicImpl implements ExternalCompanyLogic {
  public async getExternalCompany(
    parameter: ExternalCompanyParameter,
  ): Promise<ExternalCompanyResult> {
    const gbizReuqestQuery: GbizCompanyRequest = {
      corporate_number: StringUtil.ifEmpty(parameter.companyNumber),
      name: StringUtil.ifEmpty(parameter.companyName),
      // 「JIS X 0401都道府県コード」の「18」は「福井県」
      prefecture: '18',
      page: 1,
      limit: parameter.limit,
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

    const companyResult: ExternalCompanyResultItem[] =
      companyDataList?.map((x) => ({
        companyNumber: x.corporate_number,
        japaneseName: x.name,
        // 英語名が存在しない場合は、日本語名を使用する
        englishName: x.name_en === undefined ? x.name : x.name_en,
      })) || [];
    return {
      companies: companyResult,
    };
  }
}
