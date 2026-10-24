import express, { Router } from 'express';
import { CompanyGetRequestQuery } from './definition/companyGetRequest';
import { CompanyGetParameter } from './definition/companyGetParameter';
import { CompanyService } from './interface/service';
import { companySimpleValidators } from './simpleValidator';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { BaseController } from '@s/common/controller/baseController';
import { StringUtil } from '@c/util/stringUtil';
import { wrapAction } from '@s/common/middleware/controllerCatcher';
import { throwIfHasSimpleValidationResult } from '@s/common/middleware/simpleValidationResult';
import { authorizationFirebaseUser } from '@s/common/middleware/firebaseAuthorization';
import { authorizeCompanyUpdate } from './authorizeUpdate';

/**
 * 会社に関するコントローラクラス
 */
class CompanyController extends BaseController {
  public static companyGetEndpoint: string = '/companies/';
  public static async getCompanies(
    request: express.Request<
      Record<string, any> | undefined,
      null,
      null,
      CompanyGetRequestQuery
    >,
    response: express.Response,
  ) {
    const requestQuery = request.query;
    const parameter: CompanyGetParameter = {
      companyName: StringUtil.ifEmpty(requestQuery.companyName),
      userId: StringUtil.ifEmpty(response.locals.firebaseUserId),
    };
    const service = appContainer.get<CompanyService>(types.CompanyService);
    const responseDataBody = await service.getCompanies(parameter);
    super.success(response, responseDataBody);
  }

  public static async updateCompanies(
    _request: express.Request,
    response: express.Response,
  ) {
    const service = appContainer.get<CompanyService>(types.CompanyService);
    await service.updateCompanies();
    super.success(response);
  }
}

const companyRouter = Router();
companyRouter.get(
  CompanyController.companyGetEndpoint,
  // ログイン中は、自分の投稿がある企業を候補で選べなくするためにユーザーIDを取得する
  authorizationFirebaseUser(false),
  companySimpleValidators,
  throwIfHasSimpleValidationResult,
  wrapAction(CompanyController.getCompanies),
);
companyRouter.put(
  CompanyController.companyGetEndpoint,
  authorizeCompanyUpdate,
  wrapAction(CompanyController.updateCompanies),
);
export { companyRouter };
