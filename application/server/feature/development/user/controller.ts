import express, { response } from 'express';
import { Op, QueryTypes } from 'sequelize';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { SequelizeHandler } from '@s/common/sequelize/interface/SequelizeHandler';
import { LogHandler } from '@s/common/logger/interface/LogHandler';
import CompanyMaster from '@s/common/sequelize/models/companyMaster';
import UserMaster from '@s/common/sequelize/models/userMaster';

export const [userEndpoint, userController] = [
  '/development/users',
  async (_req: express.Request, res: express.Response) => {
    const logger = appContainer.get<LogHandler>(types.LogHandler);
    const sequelizeHandler = appContainer.get<SequelizeHandler>(
      types.SequelizeHandler,
    );
    const sequelize = sequelizeHandler.sequelize;

    logger.log('info', 'firebase user id', response.locals.firebaseUserId);

    console.log('ユーザ取得');
    const [users, metadata1] = await sequelize.query<UserMaster>(
      'SELECT * FROM public.user_master',
      { type: QueryTypes.SELECT },
    );
    console.log(users);
    console.log(metadata1);
    const userWhere = await UserMaster.findAll({
      where: { id: { [Op.like]: 'eUFhpDok0k' } },
    });
    console.log(userWhere);

    console.log('会社取得（query）');
    const companies = await sequelize.query<CompanyMaster>(
      'SELECT * FROM public.company_master',
      { type: QueryTypes.SELECT },
    );
    console.log(companies);
    logger.log('debug', 'debug log');
    res.send({ users, companies });
  },
];
