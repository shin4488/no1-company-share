import { Container } from 'inversify';
import 'reflect-metadata';
import { DateHandler } from '@s/common/date/interface/dateHandler';
import { DateHandlerImpl } from '@s/common/date/dateHandler';
import { types } from '@s/common/dependencyInjection/types';
import { LogHandler } from '@s/common/logger/interface/LogHandler';
import { LogHandlerImpl } from '@s/common/logger/logHandler';
import { SequelizeHandler } from '@s/common/sequelize/logic/interface/SequelizeHandler';
import { SequelizeHandlerImpl } from '@s/common/sequelize/logic/sequelizeHandler';
import { CompanyMasterDao } from '@s/commonBL/dao/company/interface/dao';
import { CompanyMasterDaoImpl } from '@s/commonBL/dao/company/dao';
import { UserMasterDao } from '@s/commonBL/dao/user/interface/dao';
import { UserMasterDaoImpl } from '@s/commonBL/dao/user/dao';
import { DivisionMasterDao } from '@s/commonBL/dao/division/interface/dao';
import { DivisionMasterDaoImpl } from '@s/commonBL/dao/division/dao';
import { ApiResponseHandler } from '@s/common/apiResponse/interface/ApiResponseHandler';
import { ApiResponseHandlerImpl } from '@s/common/apiResponse/apiResponseHandler';
import { OpenGraphService } from '@s/feature/openGraph/interface/service';
import { OpenGraphServiceImpl } from '@s/feature/openGraph/service';
import { OpenGraphLogic } from '@s/commonBL/openGraph/interface/logic';
import { OpenGraphLogicImpl } from '@s/commonBL/openGraph/logic';
import { SharedPostService } from '@s/feature/sharedPost/interface/sharedPostService';
import { SharedPostServiceImpl } from '@s/feature/sharedPost/service';
import { CompanyService } from '@s/feature/company/interface/service';
import { CompanyServiceImpl } from '@s/feature/company/service';
import { CompanyLogic } from '@s/feature/company/interface/logic';
import { CompanyLogicImpl } from '@s/feature/company/logic';
import { UserService } from '@s/feature/user/interface/service';
import { UserServiceImpl } from '@s/feature/user/service';
import { DivisionSelectItemLogicImpl } from '@s/commonBL/division/divisionSelectItemLogic';
import { DivisionSelectItemLogic } from '@s/commonBL/division/interface/divisionSelectItemLogic';
import { DivisionService } from '@s/feature/division/interface/service';
import { DivisionServiceImpl } from '@s/feature/division/service';

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
appContainer.bind<UserMasterDao>(types.UserMasterDao).to(UserMasterDaoImpl);
appContainer
  .bind<DivisionMasterDao>(types.DivisionMasterDao)
  .to(DivisionMasterDaoImpl);

appContainer
  .bind<ApiResponseHandler>(types.ApiResponseHandler)
  .to(ApiResponseHandlerImpl);
appContainer
  .bind<OpenGraphService>(types.OpenGraphService)
  .to(OpenGraphServiceImpl);
appContainer.bind<OpenGraphLogic>(types.OpenGraphLogic).to(OpenGraphLogicImpl);
appContainer
  .bind<DivisionSelectItemLogic>(types.DivisionSelectItemLogic)
  .to(DivisionSelectItemLogicImpl);
appContainer.bind<DateHandler>(types.DateHandler).to(DateHandlerImpl);

appContainer
  .bind<SharedPostService>(types.SharedPostService)
  .to(SharedPostServiceImpl);
appContainer.bind<CompanyService>(types.CompanyService).to(CompanyServiceImpl);
appContainer.bind<CompanyLogic>(types.CompanyLogic).to(CompanyLogicImpl);
appContainer.bind<UserService>(types.UserService).to(UserServiceImpl);
appContainer
  .bind<DivisionService>(types.DivisionService)
  .to(DivisionServiceImpl);

export { appContainer };
