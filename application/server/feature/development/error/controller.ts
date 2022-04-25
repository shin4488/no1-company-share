import express, { Router } from 'express';
import { RecordNotFoundError } from '@s/common/error/recordNotFoundError';
import { AppError } from '@s/common/error/appError';
import { BaseController } from '@s/common/controller/baseController';

class ErrorController extends BaseController {
  public static recordNotFoundEndpoint: string = '/development/errors/1';
  public static getRecordNotFound(
    _request: express.Request,
    _response: express.Response,
  ) {
    throw new RecordNotFoundError();
  }

  public static recordNotFoundNoDataEndpoint: string = '/development/errors/2';
  public static getRecordNotFoundNoData(
    _request: express.Request,
    _response: express.Response,
  ) {
    throw new RecordNotFoundError('データなし');
  }

  public static appErrorEndpoint: string = '/development/errors/3';
  public static getAppError(
    _request: express.Request,
    _response: express.Response,
  ) {
    throw new AppError(404, 'Apperrorが発生');
  }

  public static errorEndpoint: string = '/development/errors/4';
  public static getError(
    _request: express.Request,
    _response: express.Response,
  ) {
    throw new Error('Errorが発生');
  }
}

const errorDevelopmentRouter = Router();
errorDevelopmentRouter.get(
  ErrorController.recordNotFoundEndpoint,
  ErrorController.getRecordNotFound,
);
errorDevelopmentRouter.get(
  ErrorController.recordNotFoundNoDataEndpoint,
  ErrorController.getRecordNotFoundNoData,
);
errorDevelopmentRouter.get(
  ErrorController.appErrorEndpoint,
  ErrorController.getAppError,
);
errorDevelopmentRouter.get(
  ErrorController.errorEndpoint,
  ErrorController.getError,
);
export { errorDevelopmentRouter };
