import express, { Router } from 'express';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { LogHandler } from '@s/common/logger/interface/LogHandler';
import CompanyMaster from '@s/common/sequelize/models/companyMaster';
import { BaseController } from '@s/common/controller/baseController';
import { wrapAction } from '@s/common/middleware/controllerCatcher';

class CompanyController extends BaseController {
  public static companyEndpoint: string = '/development/companies';
  public static async createCompanies(
    _request: express.Request,
    response: express.Response,
  ) {
    const logger = appContainer.get<LogHandler>(types.LogHandler);
    logger.log('info', 'firebase user id', response.locals.firebaseUserId);

    try {
      console.log('会社取得（findAll）');
      const records = await CompanyMaster.findAll();
      console.log(records);

      console.log('会社作成（create）');
      const user1 = await CompanyMaster.create({
        companyNumber: `alice${records.length}`,
        companyJapaneseName: 'husigi ja',
        companyEnglishName: 'husigi en',
        homepageUrl: '23fghh',
      });
      console.log(user1);

      console.log('会社取得（findOne）');
      const company = await CompanyMaster.findOne({
        where: { companyNumber: `alice${records.length}` },
      });
      if (company !== null) {
        company.homepageUrl = `20qwer.com${records.length}`;
        await company.save();
      }
      console.log(company);

      const records2 = await CompanyMaster.findAll<CompanyMaster>();
      super.success(response, { companies: records2 });
    } catch (e) {
      logger.error(e);
    }
  }
}

const companyDevelopmentRouter = Router();
companyDevelopmentRouter.post(
  CompanyController.companyEndpoint,
  wrapAction(CompanyController.createCompanies),
);
export { companyDevelopmentRouter };
