import { injectable } from 'inversify';
import { SharedPostPostParameter } from './definition/sharedPostPostParameter';
import { SharedPostPutParameter } from './definition/sharedPostPutParameter';
import { SharedPostComplexValidator } from './interface/complexValidator';
import DivisionMaster from '@s/common/sequelize/models/divisionMaster';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { BadParameterErrorHandler } from '@s/common/error/handler/interface/badParameterErrorHandler';
import { StringUtil } from '@c/util/stringUtil';

@injectable()
export class SharedPostComplexValidatorImple
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
          detail.no1Division,
        );
        if (StringUtil.isEmpty(validationErrorMessage)) {
          errorHandler.addMessage(
            'No1.区分:区分値マスタに存在する値を入力してください。',
          );
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
      // 投稿の存在チェック
      // 作成時と更新リクエスト送信者の一致チェック（既存の投稿．投稿者ID=リクエスト．ユーザID）
      // 会社マスタの存在チェック
      const postDetails = post.postDetails;
      for (const detail of postDetails) {
        // 区分値マスタの存在チェック
        const validationErrorMessage = await this.validateExistingNo1Division(
          detail.no1Division,
        );
        if (StringUtil.isEmpty(validationErrorMessage)) {
          errorHandler.addMessage(
            'No1.区分:区分値マスタに存在する値を入力してください。',
          );
        }
      }
    }

    errorHandler.throwIfHasError();
  }

  private async validateExistingNo1Division(
    no1Division: string,
  ): Promise<string | null> {
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
}
