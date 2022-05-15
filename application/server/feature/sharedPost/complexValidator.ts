import { injectable } from 'inversify';
import { SharedPostPostParameter } from './definition/sharedPostPostParameter';
import { SharedPostPutParameter } from './definition/sharedPostPutParameter';
import { SharedPostComplexValidator } from './interface/complexValidator';
import DivisionMaster from '@s/common/sequelize/models/divisionMaster';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { BadParameterErrorHandler } from '@s/common/error/handler/interface/badParameterErrorHandler';
import { StringUtil } from '@c/util/stringUtil';
import SharedPost from '@s/common/sequelize/models/sharedPost';
import CompanyMaster from '@s/common/sequelize/models/companyMaster';

@injectable()
export class SharedPostComplexValidatorImpl
  implements SharedPostComplexValidator
{
  public async validateForInsert(
    parameter: SharedPostPostParameter,
  ): Promise<void> {
    const errorHandler = appContainer.get<BadParameterErrorHandler>(
      types.BadParameterErrorHandler,
    );

    const posts = parameter.posts;
    for (const post of posts) {
      const postDetails = post.postDetails;
      for (const detail of postDetails) {
        // 区分値マスタの存在チェック
        const validationErrorMessage = await this.validateExistingNo1Division(
          Number(detail.no1Division),
        );
        if (StringUtil.isNotEmpty(validationErrorMessage)) {
          errorHandler.addMessage(validationErrorMessage);
        }
      }
    }

    errorHandler.throwIfHasError();
  }

  public async validateForUpdate(
    parameter: SharedPostPutParameter,
  ): Promise<void> {
    const errorHandler = appContainer.get<BadParameterErrorHandler>(
      types.BadParameterErrorHandler,
    );

    const posts = parameter.posts;
    for (const post of posts) {
      const sharedPostId = post.id;
      // 投稿の存在チェック
      const validateErrorMessage = await this.validateExistingSharedPost(
        sharedPostId,
      );
      if (StringUtil.isNotEmpty(validateErrorMessage)) {
        errorHandler.addMessage(validateErrorMessage);
      }

      // 作成者と更新リクエスト送信者の一致チェック（既存の投稿．投稿者ID=リクエスト．ユーザID）
      const userErrorMessage = await this.validateUserEquality(
        sharedPostId,
        parameter.userId,
      );
      if (StringUtil.isNotEmpty(userErrorMessage)) {
        errorHandler.addMessage(userErrorMessage);
      }

      // 会社マスタの存在チェック
      const companyErrorMessage = await this.validateExistingCompany(
        post.companyNumber,
      );
      if (StringUtil.isNotEmpty(companyErrorMessage)) {
        errorHandler.addMessage(companyErrorMessage);
      }

      const postDetails = post.postDetails;
      for (const detail of postDetails) {
        // 区分値マスタの存在チェック
        const validationErrorMessage = await this.validateExistingNo1Division(
          Number(detail.no1Division),
        );
        if (StringUtil.isNotEmpty(validationErrorMessage)) {
          errorHandler.addMessage(validationErrorMessage);
        }
      }
    }

    errorHandler.throwIfHasError();
  }

  private async validateExistingNo1Division(
    no1Division: number,
  ): Promise<string> {
    const targetDivision = await DivisionMaster.findOne({
      where: {
        columnPhysicalName: 'NO1_DIVISION',
        id: no1Division,
      },
    });

    return targetDivision === null
      ? 'No1.区分:区分値マスタに存在する値を入力してください。'
      : '';
  }

  private async validateExistingSharedPost(
    sharedPostNo: string,
  ): Promise<string> {
    const targetSharedPost = await SharedPost.findByPk(sharedPostNo);
    return targetSharedPost === null
      ? '存在する投稿の投稿No.を入力してください。'
      : '';
  }

  private async validateUserEquality(
    sharedPostNo: string,
    loginUserId: string,
  ): Promise<string> {
    const targetSharedPost = await SharedPost.findByPk(sharedPostNo);
    const createdUserId = targetSharedPost?.userId;
    return createdUserId !== loginUserId
      ? '投稿したユーザのみが編集できます。'
      : '';
  }

  private async validateExistingCompany(
    companyNumber: string,
  ): Promise<string> {
    const targetCompany = await CompanyMaster.findByPk(companyNumber);
    return targetCompany === null
      ? '登録済み会社の法人番号を入力してください。'
      : '';
  }
}
