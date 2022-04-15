// serverMiddlewareに登録されたサーバ処理ではaliasを使用できないので、module-aliasというライブラリを使っている
// https://github.com/nuxt/nuxt.js/issues/4580
// https://github.com/nuxt/nuxt.js/issues/7017
import 'module-alias/register';
import express, { json, urlencoded } from 'express';
import { Sequelize } from 'sequelize';
import { FirebaseAuth } from '@s/commons/middleware/firebaseAuth';

const app = express();
// リクエストボディがundefinedにならないようにする
app.use(json());
app.use(urlencoded({ extended: true }));

app.get(
  '/api/v1/development1',
  async (_req: express.Request, res: express.Response) => {
    const instance = new FirebaseAuth('ccdd');
    const result = instance.validateToken();
    console.log(result);
    try {
      console.log(process.env.DB_CONNECTION_URI);
      const sequelize = new Sequelize(process.env.DB_CONNECTION_URI || '');
      await sequelize.authenticate();
      console.log('sequelize.authenticated');
    } catch (e) {
      console.log(e);
    }
    res.send({ aaa: 123, bbb: [11, false, 'wer'] });
  },
);

app.get(
  '/api/v1/development2',
  (_req: express.Request, res: express.Response) => {
    res.send({ url: '/api/v1/development2' });
  },
);

app.get(
  '/api/v1/development',
  (req: express.Request, res: express.Response) => {
    console.log(req);
    console.log(res);
    res.send({ aaa: 123, bbb: 'abcdd' });
  },
);

export default app;
