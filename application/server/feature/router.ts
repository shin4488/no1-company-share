import { Router } from 'express';
import { openGraphRouter } from './openGraph/controller';
import { companyRouter } from './company/controller';
import { sharedPostRouter } from './sharedPost/controller';
import { developmentRouter } from './development/router';
import { userRouter } from './user/controller';

const appRouter = Router();
appRouter.use(openGraphRouter);
appRouter.use(companyRouter);
appRouter.use(sharedPostRouter);
appRouter.use(userRouter);

if (process.env.NODE_ENV === 'development') {
  appRouter.use(developmentRouter);
}

export { appRouter };
