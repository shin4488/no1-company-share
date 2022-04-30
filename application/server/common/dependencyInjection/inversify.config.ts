import { Container } from 'inversify';
import 'reflect-metadata';
import { types } from '@s/common/dependencyInjection/types';
import { LogHandlerImpl } from '@s/common/logger/logHandler';
import { LogHandler } from '@s/common/logger/interface/LogHandler';
import { SequelizeHandlerImpl } from '@s/common/sequelize/sequelizeHandler';
import { SequelizeHandler } from '@s/common/sequelize/interface/SequelizeHandler';
import { ApiResponseHandler } from '@s/common/apiResponse/interface/ApiResponseHandler';
import { ApiResponseHandlerImpl } from '@s/common/apiResponse/apiResponseHandler';
import { SharedPostService } from '@s/feature/sharedPost/interface/sharedPostService';
import { SharedPostServiceImpl } from '@s/feature/sharedPost/service';
import { OpenGraphLogic } from '@s/commonBL/openGraph/interface/logic';
import { OpenGraphLogicImpl } from '@s/commonBL/openGraph/logic';
import { OpenGraphServiceImpl } from '@s/feature/openGraph/service';
import { OpenGraphService } from '@s/feature/openGraph/interface/service';

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
appContainer
  .bind<SharedPostService>(types.SharedPostService)
  .to(SharedPostServiceImpl);
appContainer.bind<OpenGraphLogic>(types.OpenGraphLogic).to(OpenGraphLogicImpl);
appContainer
  .bind<OpenGraphService>(types.OpenGraphService)
  .to(OpenGraphServiceImpl);

export { appContainer };
