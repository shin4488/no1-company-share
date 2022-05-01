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
import { CompanyService } from '@s/feature/company/interface/service';
import { CompanyServiceImpl } from '@s/feature/company/service';
import { CompanyMasterDao } from '@s/commonBL/dao/company/interface/dao';
import { CompanyMasterDaoImpl } from '@s/commonBL/dao/company/dao';
import { CompanyLogicImpl } from '@s/feature/company/logic';
import { CompanyLogic } from '@s/feature/company/interface/logic';

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
  .bind<CompanyMasterDao>(types.CompanyMasterDao)
  .to(CompanyMasterDaoImpl);

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
appContainer.bind<CompanyService>(types.CompanyService).to(CompanyServiceImpl);
appContainer.bind<CompanyLogic>(types.CompanyLogic).to(CompanyLogicImpl);

export { appContainer };
