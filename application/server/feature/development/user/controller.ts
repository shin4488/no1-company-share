import express, { Router } from 'express';
import { Op, QueryTypes } from 'sequelize';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { SequelizeHandler } from '@s/common/sequelize/logic/interface/SequelizeHandler';
import { LogHandler } from '@s/common/logger/interface/LogHandler';
import CompanyMaster from '@s/common/sequelize/models/companyMaster';
import UserMaster from '@s/common/sequelize/models/userMaster';
import { BaseController } from '@s/common/controller/baseController';
import { authorizationFirebaseUser } from '@s/common/middleware/firebaseAuthorization';
import { wrapAction } from '@s/common/middleware/controllerCatcher';

class UserController extends BaseController {
  public static userEndpoint: string = '/development/users';
  public static async getUsers(
    _request: express.Request,
    response: express.Response,
  ) {
    const logger = appContainer.get<LogHandler>(types.LogHandler);
    const sequelizeHandler = appContainer.get<SequelizeHandler>(
      types.SequelizeHandler,
    );
    const sequelize = sequelizeHandler.sequelize;

    logger.log('debug', 'firebase user id', response.locals.firebaseUserId);

    const users = await sequelize.query<UserMaster>(
      'SELECT * FROM public.user_master',
      { type: QueryTypes.SELECT },
    );
    const userWhere = await UserMaster.findAll({
      where: { id: { [Op.like]: 'eUFhpDok0k' } },
    });
    console.log(userWhere);

    const companies = await sequelize.query<CompanyMaster>(
      'SELECT * FROM public.company_master',
      { type: QueryTypes.SELECT },
    );
    logger.log('debug', 'debug log');

    super.success(response, { users, companies });
  }
}

const userDevelopmentRouter = Router();
userDevelopmentRouter.post(
  UserController.userEndpoint,
  authorizationFirebaseUser(),
  wrapAction(UserController.getUsers),
);
export { userDevelopmentRouter };
