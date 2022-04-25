// serverMiddlewareに登録されたサーバ処理ではaliasを使用できないので、module-aliasというライブラリを使っている
// https://github.com/nuxt/nuxt.js/issues/4580
// https://github.com/nuxt/nuxt.js/issues/7017
import 'module-alias/register';
import express, { json, urlencoded } from 'express';
import Admin from 'firebase-admin';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { LogHandler } from '@s/common/logger/interface/LogHandler';
import { SequelizeHandler } from '@s/common/sequelize/interface/SequelizeHandler';
import { logRequestResponse } from '@s/common/middleware/logger';
import { authorizationFirebaseUser } from '@s/common/middleware/firebaseAuthorization';
import { catchError } from '@s/common/middleware/appErrorHandler';
import { appRouter } from '@s/feature/router';

// DIコンテナからインスタンス取得
const logger = appContainer.get<LogHandler>(types.LogHandler);
// Sequelize初期化のため
appContainer.get<SequelizeHandler>(types.SequelizeHandler);

// デフォルトで「FIREBASE_CONFIG」環境変数のパスにある秘密鍵を見に行くため、引数不要
const firebaseApps = Admin.apps;
if (firebaseApps === null || firebaseApps.length === 0) {
  Admin.initializeApp();
}

const app = express();
// リクエストボディがundefinedにならないようにする
app.use(json());
app.use(urlencoded({ extended: true }));
// アクセスログをログファイルに出力
const accessLoggerMiddleware = logger.getAccessLoggerMiddleware();
app.use(accessLoggerMiddleware);
app.use(logRequestResponse);
app.use(authorizationFirebaseUser);

app.use('/api/v1', appRouter);

// 例外発生キャッチ用のミドルウェアはルーティング後に追加する必要がある
// 参照：「エラー処理を記述する」：https://expressjs.com/ja/guide/error-handling.html
app.use(catchError);

export default app;
