import express, { json, urlencoded } from 'express';
import { getFirebaseApp } from '@s/firebaseApp';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { LogHandler } from '@s/common/logger/interface/LogHandler';
import { SequelizeHandler } from '@s/common/sequelize/logic/interface/SequelizeHandler';
import { logRequestResponse } from '@s/common/middleware/logger';
import { catchError } from '@s/common/middleware/appErrorHandler';
import { appRouter } from '@s/feature/router';

const logger = appContainer.get<LogHandler>(types.LogHandler);
// モデルの静的メソッドを使う前に、生成時の処理でSequelizeとモデルを初期化しておく
appContainer.get<SequelizeHandler>(types.SequelizeHandler);

getFirebaseApp();

const app = express();
// JSONのリクエストボディを解析する。解析対象がないリクエストではbodyはundefinedのまま
app.use(json());
app.use(urlencoded({ extended: true }));
// アクセスログをログファイルに出力
const accessLoggerMiddleware = logger.getAccessLoggerMiddleware();
app.use(accessLoggerMiddleware);
app.use(logRequestResponse);

// SSRで使う従来のlocalhost付きパスも同じAPIへ渡す。
app.use('/api/v1/localhost', appRouter);
app.use('/api/v1', appRouter);

// 例外発生キャッチ用のミドルウェアはルーティング後に追加する必要がある
// 参照：「エラー処理を記述する」：https://expressjs.com/ja/guide/error-handling.html
app.use(catchError);

export default app;
