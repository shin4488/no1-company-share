import { Container } from 'inversify';
import 'reflect-metadata';
import { types } from '@s/common/dependencyInjection/types';
import { LogHandlerImpl } from '@s/common/logger/logHandler';
import { LogHandler } from '@s/common/logger/interface/LogHandler';
import { SequelizeHandlerImpl } from '@s/common/sequelize/sequelizeHandler';
import { SequelizeHandler } from '@s/common/sequelize/interface/SequelizeHandler';
import { ApiResponseHandler } from '@s/common/apiResponse/interface/ApiResponseHandler';
import { ApiResponseHandlerImpl } from '@s/common/apiResponse/apiResponseHandler';

const appContainer = new Container();
appContainer
  .bind<LogHandler>(types.LogHandler)
  .to(LogHandlerImpl)
  .inSingletonScope();
appContainer
  .bind<SequelizeHandler>(types.SequelizeHandler)
  .to(SequelizeHandlerImpl)
  .inSingletonScope();
appContainer
  .bind<ApiResponseHandler>(types.ApiResponseHandler)
  .to(ApiResponseHandlerImpl);

export { appContainer };
