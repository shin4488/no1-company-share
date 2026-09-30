import express, { Router } from 'express';
import { CompanyGetRequestQuery } from './definition/companyGetRequest';
import { CompanyService } from './interface/service';
import { companySimpleValidators } from './simpleValidator';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { BaseController } from '@s/common/controller/baseController';
import { StringUtil } from '@c/util/stringUtil';
import { wrapAction } from '@s/common/middleware/controllerCatcher';
import { authorizeCompanyUpdate } from './authorizeUpdate';

/**
 * 投稿処理に関するコントローラクラス
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
    const parameter = {
      companyName: StringUtil.ifEmpty(requestQuery.companyName),
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
  companySimpleValidators,
  wrapAction(CompanyController.getCompanies),
);
companyRouter.put(
  CompanyController.companyGetEndpoint,
  authorizeCompanyUpdate,
  wrapAction(CompanyController.updateCompanies),
);
export { companyRouter };
