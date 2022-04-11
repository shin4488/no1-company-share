import express, { json, urlencoded } from 'express';

const app = express();
// リクエストボディがundefinedにならないようにする
app.use(json());
app.use(urlencoded({ extended: true }));
app.get(
  '/api/v1/development',
  (req: express.Request, res: express.Response) => {
    console.log(req);
    console.log(res);
    res.send({ aaa: 123, bbb: 'abcdd' });
  },
);

export default app;
