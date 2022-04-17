// serverMiddlewareに登録されたサーバ処理ではaliasを使用できないので、module-aliasというライブラリを使っている
// https://github.com/nuxt/nuxt.js/issues/4580
// https://github.com/nuxt/nuxt.js/issues/7017
import 'module-alias/register';
import express, { json, urlencoded } from 'express';
import { Op, QueryTypes } from 'sequelize';
import SequelizeHandler from '@s/commons/sequelize/sequelizeHandler';
import CompanyMaster from '@s/commons/sequelize/models/companyMaster';
import {
  dbHandlerEndpoint,
  handleDatabase,
} from '@s/features/development/dbHandler';
import UserMaster from '@s/commons/sequelize/models/userMaster';

const app = express();
// リクエストボディがundefinedにならないようにする
app.use(json());
app.use(urlencoded({ extended: true }));

const sequelize = SequelizeHandler.initialize();

app.get(dbHandlerEndpoint, handleDatabase);

app.get(
  '/api/v1/development2',
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
    res.send({ users, companies });
  },
);

export default app;
