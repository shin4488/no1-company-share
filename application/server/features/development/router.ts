import { Router } from 'express';
import {
  companyEndpoint,
  companyController,
} from '@s/features/development/company/controller';
import {
  userEndpoint,
  userController,
} from '@s/features/development/user/controller';

const developmentRouter = Router();
developmentRouter.get(companyEndpoint, companyController);
developmentRouter.get(userEndpoint, userController);

export { developmentRouter };
