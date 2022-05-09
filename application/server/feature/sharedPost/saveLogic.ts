import { inject, injectable } from 'inversify';
import { Transaction } from 'sequelize';
import { SharedPostIdCreationParameter } from './definition/sharedPostIdCreationParameter';
import { SharedPostSaveLogic } from './interface/saveLogic';
import { SharedPostSaveParameter } from './definition/sharedPostSaveParameter';
import { SharedPostSaveResult } from './definition/sharedPostSaveResult';
import { types } from '@s/common/dependencyInjection/types';
import { DateHandler } from '@s/common/date/interface/dateHandler';
import { StringUtil } from '@c/util/stringUtil';
import companyMaster from '@s/common/sequelize/models/companyMaster';
import sharedPost from '@s/common/sequelize/models/sharedPost';
import { CompanyMasterDao } from '@s/commonBL/dao/company/interface/dao';
import { ArrayUtil } from '@c/util/arrayUtil';
import { ExternalCompanyLogic } from '@s/commonBL/externalCompany/interface/logic';
import { ExternalCompanyParameter } from '@s/commonBL/externalCompany/definition/externalCompanyParameter';

@injectable()
export class SharedPostSaveLogicImpl implements SharedPostSaveLogic {
  private companyMasterDao: CompanyMasterDao;
  private dateHandler: DateHandler;
  private externalCompanyLogic: ExternalCompanyLogic;

  constructor(
    @inject(types.CompanyMasterDao) companyMasterDao: CompanyMasterDao,
    @inject(types.DateHandler) dateHandler: DateHandler,
    @inject(types.ExternalCompanyLogic)
    externalCompanyLogic: ExternalCompanyLogic,
  ) {
    this.companyMasterDao = companyMasterDao;
    this.dateHandler = dateHandler;
    this.externalCompanyLogic = externalCompanyLogic;
  }

  public async createModels(
    parameter: SharedPostSaveParameter,
    transaction: Transaction,
    createSharedPost: (company: companyMaster) => Promise<sharedPost>,
  ): Promise<SharedPostSaveResult> {
    // 将来的に英語表記を使用するため、英語名も取得・保存する
    const externalCompanyParameter: ExternalCompanyParameter = {
      companyNumber: parameter.companyNumber,
      limit: 1,
    };
    const companyResult = await this.externalCompanyLogic.getExternalCompany(
      externalCompanyParameter,
    );
    const companyResultItems = companyResult.companies;
    let companyEnglishName = '';
    if (ArrayUtil.isNotEmpty(companyResultItems)) {
      companyEnglishName = companyResultItems[0].englishName;
    }

    // 会社マスタ作成
    const company = await this.companyMasterDao.upsertCompany(
      {
        companyNumber: parameter.companyNumber,
        companyJapaneseName: parameter.companyName,
        companyEnglishName,
        homepageUrl: parameter.companyHomepageUrl,
      },
      transaction,
    );

    // 投稿作成
    const createdPost = await createSharedPost(company);

    // 投稿明細作成
    // 投稿詳細は、送られたもののみを残すため、delete→insertで更新
    const currentDetails = await createdPost.getSharedPostDetails();
    if (ArrayUtil.isNotEmpty(currentDetails)) {
      await Promise.all(
        currentDetails.map(async (x) => await x.destroy({ transaction })),
      );
    }

    const details = parameter.postDetails;
    await Promise.all(
      details.map(async (detail, index) => {
        await createdPost.createSharedPostDetail(
          {
            id: index,
            no1Content: detail.no1Content,
            no1Division: Number(detail.no1Division),
          },
          {
            transaction,
          },
        );
      }),
    );

    return {
      id: createdPost.id,
      updatedAt: createdPost.updatedAt.toString(),
    };
  }

  public createSharedPostId(parameter: SharedPostIdCreationParameter): string {
    const currentDate = this.dateHandler.getCurrentDate();
    const month = currentDate.getMonth() + 1;
    const paddingMonth = this.padZeroByTwoDigitString(month);
    const date = currentDate.getDate();
    const paddingDate = this.padZeroByTwoDigitString(date);
    const hour = currentDate.getHours();
    const paddingHour = this.padZeroByTwoDigitString(hour);
    const minute = currentDate.getMinutes();
    const paddingMinute = this.padZeroByTwoDigitString(minute);
    const second = currentDate.getSeconds();
    const paddingSecond = this.padZeroByTwoDigitString(second);
    const milliSecond = currentDate.getMilliseconds();
    const paddingMilliSecond = this.padZeroByTwoDigitString(milliSecond, 3);
    const joinedDateTimeString =
      `${currentDate.getFullYear()}${paddingMonth}${paddingDate}` +
      `${paddingHour}${paddingMinute}${paddingSecond}${paddingMilliSecond}`;
    const companyNumber = parameter.companyNumber;
    const userId = parameter.userId;
    const postId = `${companyNumber}${userId}${joinedDateTimeString}`;

    return postId;
  }

  private padZeroByTwoDigitString(
    value: number,
    maxLength: number = 2,
  ): string {
    return StringUtil.toString(value).padStart(maxLength, '0');
  }
}
