import { Router } from 'express';
import { openGraphRouter } from './openGraph/controller';
import { sharedPostRouter } from './sharedPost/controller';
import { developmentRouter } from './development/router';

const appRouter = Router();
appRouter.use(openGraphRouter);
appRouter.use(sharedPostRouter);

if (process.env.NODE_ENV === 'development') {
  appRouter.use(developmentRouter);
}

export { appRouter };
