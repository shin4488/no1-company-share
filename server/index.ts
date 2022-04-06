import express from 'express';

const app = express();
// リクエストボディがundefinedにならないようにする
app.use(express.json());
app.get('/api/v1/development', (req, res) => {
  console.log(req);
  console.log(res);
  res.send({ aaa: 123, bbb: 'abcdd' });
});

export default app;
