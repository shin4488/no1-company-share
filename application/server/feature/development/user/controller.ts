import express from 'express';
import { Op, QueryTypes } from 'sequelize';
import { sequelize } from '@s/common/sequelize/sequelizeHandler';
import { systemLogger } from '@s/common/logger/logHandler';
import CompanyMaster from '@s/common/sequelize/models/companyMaster';
import UserMaster from '@s/common/sequelize/models/userMaster';

export const [userEndpoint, userController] = [
  '/development/users',
  async (_req: express.Request, res: express.Response) => {
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
    systemLogger.debug('debug log');
    res.send({ users, companies });
  },
];
