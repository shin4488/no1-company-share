import { Router } from 'express';
import {
  errorEndpoint1,
  errorController1,
  errorEndpoint2,
  errorController2,
  errorEndpoint3,
  errorController3,
  errorEndpoint4,
  errorController4,
} from '@s/feature/development/error/controller';
import {
  companyEndpoint,
  companyController,
} from '@s/feature/development/company/controller';
import {
  userEndpoint,
  userController,
} from '@s/feature/development/user/controller';

const developmentRouter = Router();
developmentRouter.get(companyEndpoint, companyController);
developmentRouter.post(userEndpoint, userController);
developmentRouter.get(errorEndpoint1, errorController1);
developmentRouter.get(errorEndpoint2, errorController2);
developmentRouter.get(errorEndpoint3, errorController3);
developmentRouter.get(errorEndpoint4, errorController4);

export { developmentRouter };
