// serverMiddlewareに登録されたサーバ処理ではaliasを使用できないので、module-aliasというライブラリを使っている
// https://github.com/nuxt/nuxt.js/issues/4580
// https://github.com/nuxt/nuxt.js/issues/7017
import 'module-alias/register';
import '@s/commons/sequelize/sequelizeHandler';
import express, { json, urlencoded } from 'express';
import { accessLoggerMiddleware } from '@s/commons/logger/logHandler';
import { logRequestResponse } from '@s/commons/middleware/logger';
import { catchError } from '@s/commons/middleware/appErrorHandler';
import { developmentRouter } from '@s/features/development/router';

const app = express();
// リクエストボディがundefinedにならないようにする
app.use(json());
app.use(urlencoded({ extended: true }));
// アクセスログをログファイルに出力
app.use(accessLoggerMiddleware);
app.use(logRequestResponse);

const rootEndpoint = '/api/v1';
app.use(rootEndpoint, developmentRouter);

// 例外発生キャッチ用のミドルウェアはルーティング後に追加する必要がある
// 参照：「エラー処理を記述する」：https://expressjs.com/ja/guide/error-handling.html
app.use(catchError);

export default app;
