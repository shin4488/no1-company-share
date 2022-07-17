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
import { OpenGraphLogic } from '@s/commonBL/openGraph/interface/logic';
import { OpenGraphType } from '@s/commonBL/openGraph/definition/openGraphType';
import CompanyMaster from '@s/common/sequelize/models/companyMaster';

@injectable()
export class CompanyServiceImpl implements CompanyService {
  private logic: CompanyLogic;
  private externalCompanyLogic: ExternalCompanyLogic;
  private openGraphLogic: OpenGraphLogic;

  constructor(
    @inject(types.CompanyLogic) logic: CompanyLogic,
    @inject(types.ExternalCompanyLogic)
    externalCompanyLogic: ExternalCompanyLogic,
    @inject(types.OpenGraphLogic) openGraphLogic: OpenGraphLogic,
  ) {
    this.logic = logic;
    this.externalCompanyLogic = externalCompanyLogic;
    this.openGraphLogic = openGraphLogic;
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

  public async updateCompanies(): Promise<void> {
    // バッチ処理での起動を想定しており、リアルタイム性は要求されないため処理の完了を待っていない
    const companyMasterRecords = await CompanyMaster.findAll({
      attributes: ['companyNumber', 'homepageUrl'],
      raw: true,
    });
    // 会社ホームページURLからOG画像取得
    const overwrittenCompanyMasters = await Promise.all(
      companyMasterRecords.map(async (companyMasterRecord) => {
        const ogResult = await this.openGraphLogic.getOpenGraph(
          companyMasterRecord.homepageUrl,
          [OpenGraphType.IMAGE],
        );
        companyMasterRecord.imageUrl = ogResult.image;
        return companyMasterRecord;
      }),
    );
    // 複数レコードをまとめてupdateしたいためbulkCreateを使用
    CompanyMaster.bulkCreate(overwrittenCompanyMasters, {
      updateOnDuplicate: ['imageUrl', 'updatedAt'],
    });
  }
}
