import { Router } from 'express';
import { errorDevelopmentRouter } from '@s/feature/development/error/controller';
import { companyDevelopmentRouter } from '@s/feature/development/company/controller';
import { userDevelopmentRouter } from '@s/feature/development/user/controller';

const developmentRouter = Router();
developmentRouter.use(errorDevelopmentRouter);
developmentRouter.use(companyDevelopmentRouter);
developmentRouter.use(userDevelopmentRouter);

export { developmentRouter };
