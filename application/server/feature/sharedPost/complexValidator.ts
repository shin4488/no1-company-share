import { inject, injectable } from 'inversify';
import { Transaction } from 'sequelize';
import { SharedPostPostParameter } from './definition/sharedPostPostParameter';
import { SharedPostPutParameter } from './definition/sharedPostPutParameter';
import { SharedPostComplexValidator } from './interface/complexValidator';
import { SharedPostDeleteParameter } from './definition/sharedPostDeleteParameter';
import { ReportPostParameter } from './definition/reportPostParameter';
import DivisionMaster from '@s/common/sequelize/models/divisionMaster';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { BadParameterErrorHandler } from '@s/common/error/handler/interface/badParameterErrorHandler';
import { StringUtil } from '@c/util/stringUtil';
import SharedPost from '@s/common/sequelize/models/sharedPost';
import CompanyMaster from '@s/common/sequelize/models/companyMaster';
import { SharedPostDao } from '@s/commonBL/dao/sharedPost/interface/dao';
import { ArrayUtil } from '@c/util/arrayUtil';

@injectable()
export class SharedPostComplexValidatorImpl implements SharedPostComplexValidator {
  private sharedPostDao: SharedPostDao;

  constructor(@inject(types.SharedPostDao) sharedPostDao: SharedPostDao) {
    this.sharedPostDao = sharedPostDao;
  }

  public async validateForInsert(
    parameter: SharedPostPostParameter,
  ): Promise<void> {
    const errorHandler = appContainer.get<BadParameterErrorHandler>(
      types.BadParameterErrorHandler,
    );

    const posts = parameter.posts;
    const companyNumbers = posts.map((x) => x.companyNumber);
    if (new Set(companyNumbers).size < companyNumbers.length) {
      errorHandler.addMessage('同じ企業に関する投稿が複数含まれています。');
    }

    for (const post of posts) {
      // 同じ企業の投稿は、ほかのユーザーの投稿があっても作れる。同じユーザーの2件目だけを拒否する
      const companyErrorMessage =
        await this.validateExistingNonReportedAliveSameCompanyPost(
          parameter.userId,
          [post.companyNumber],
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

  public async validateSameCompanyPostsInTransaction(
    parameter: SharedPostPostParameter,
    transaction: Transaction,
  ): Promise<void> {
    const errorHandler = appContainer.get<BadParameterErrorHandler>(
      types.BadParameterErrorHandler,
    );
    const companyErrorMessage =
      await this.validateExistingNonReportedAliveSameCompanyPost(
        parameter.userId,
        parameter.posts.map((x) => x.companyNumber),
        transaction,
      );
    if (StringUtil.isNotEmpty(companyErrorMessage)) {
      errorHandler.addMessage(companyErrorMessage);
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
      // 削除・通報された投稿は画面に表示されず編集できないため、存在しない投稿と同じく拒否する
      const validateErrorMessage =
        await this.validateExistingNonReportedAliveSharedPost(sharedPostId);
      if (StringUtil.isNotEmpty(validateErrorMessage)) {
        errorHandler.addMessage(validateErrorMessage);
      }

      // 画面の編集では会社を変えられないため、APIでも投稿の会社を変更させない
      const companyChangeErrorMessage = await this.validateUnchangedCompany(
        sharedPostId,
        post.companyNumber,
      );
      if (StringUtil.isNotEmpty(companyChangeErrorMessage)) {
        errorHandler.addMessage(companyChangeErrorMessage);
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

  public async validateForDelete(
    parameter: SharedPostDeleteParameter,
  ): Promise<void> {
    const errorHandler = appContainer.get<BadParameterErrorHandler>(
      types.BadParameterErrorHandler,
    );

    const posts = parameter.posts;
    const userId = parameter.userId;
    for (const post of posts) {
      const sharedPostId = post.id;

      // 削除しようとしている投稿の存在
      const notExistingPostErrorMessage =
        await this.validateExistingSharedPost(sharedPostId);
      if (StringUtil.isNotEmpty(notExistingPostErrorMessage)) {
        errorHandler.addMessage(notExistingPostErrorMessage);
      }

      // 投稿したユーザと削除しようとしているユーザの一致
      const userErrorMessage = await this.validateUserEquality(
        sharedPostId,
        userId,
      );
      if (StringUtil.isNotEmpty(userErrorMessage)) {
        errorHandler.addMessage(userErrorMessage);
      }
    }

    errorHandler.throwIfHasError();
  }

  public async validateForReport(
    parameter: ReportPostParameter,
  ): Promise<void> {
    const errorHandler = appContainer.get<BadParameterErrorHandler>(
      types.BadParameterErrorHandler,
    );

    const posts = parameter.posts;
    for (const post of posts) {
      const sharedPostId = post.id;

      // 通報しようとしている投稿の存在
      const notExistingPostErrorMessage =
        await this.validateExistingSharedPost(sharedPostId);
      if (StringUtil.isNotEmpty(notExistingPostErrorMessage)) {
        errorHandler.addMessage(notExistingPostErrorMessage);
      }
    }

    errorHandler.throwIfHasError();
  }

  private async validateExistingNonReportedAliveSameCompanyPost(
    userId: string,
    companyNumbers: string[],
    transaction?: Transaction,
  ): Promise<string> {
    const sameCompanySharedPosts =
      await this.sharedPostDao.getNonReportedAliveByUserAndCompanyNumbers(
        userId,
        companyNumbers,
        transaction,
      );

    return ArrayUtil.isNotEmpty(sameCompanySharedPosts)
      ? '同じ企業に関する自分の投稿がすでに存在します。'
      : '';
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
      ? 'No.1区分:区分値マスタに存在する値を入力してください。'
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

  private async validateExistingNonReportedAliveSharedPost(
    sharedPostNo: string,
  ): Promise<string> {
    const targetSharedPost = await SharedPost.findOne({
      where: { id: sharedPostNo, isDeleted: false, isReported: false },
    });
    return targetSharedPost === null
      ? '存在する投稿の投稿No.を入力してください。'
      : '';
  }

  private async validateUnchangedCompany(
    sharedPostNo: string,
    companyNumber: string,
  ): Promise<string> {
    const targetSharedPost = await SharedPost.findByPk(sharedPostNo);
    // 投稿がないときは、投稿の存在チェックのメッセージだけを返す
    return targetSharedPost !== null &&
      targetSharedPost.companyNumber !== companyNumber
      ? '投稿の会社は変更できません。'
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
