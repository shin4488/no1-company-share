// serverMiddlewareに登録されたサーバ処理ではaliasを使用できないので、module-aliasというライブラリを使っている
// https://github.com/nuxt/nuxt.js/issues/4580
// https://github.com/nuxt/nuxt.js/issues/7017
import 'module-alias/register';
import express, { json, urlencoded } from 'express';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { LogHandler } from '@s/common/logger/interface/LogHandler';
import { SequelizeHandler } from '@s/common/sequelize/interface/SequelizeHandler';
import { logRequestResponse } from '@s/common/middleware/logger';
import { authorizationFirebaseUser } from '@s/common/middleware/firebaseAuthrization';
import { catchError } from '@s/common/middleware/appErrorHandler';
import { developmentRouter } from '@s/feature/development/router';

// DIコンテナからインスタンス取得
const logger = appContainer.get<LogHandler>(types.LogHandler);
// Sequelize初期化のため
appContainer.get<SequelizeHandler>(types.SequelizeHandler);

const app = express();
// リクエストボディがundefinedにならないようにする
app.use(json());
app.use(urlencoded({ extended: true }));
// アクセスログをログファイルに出力
const accessLoggerMiddleware = logger.getAccessLoggerMiddleware();
app.use(accessLoggerMiddleware);
app.use(logRequestResponse);
app.use(authorizationFirebaseUser);

const rootEndpoint = '/api/v1';
app.use(rootEndpoint, developmentRouter);

// 例外発生キャッチ用のミドルウェアはルーティング後に追加する必要がある
// 参照：「エラー処理を記述する」：https://expressjs.com/ja/guide/error-handling.html
app.use(catchError);

export default app;
