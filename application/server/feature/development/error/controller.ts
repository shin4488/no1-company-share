import express from 'express';
import { RecordNotFoundError } from '@s/common/error/recordNotFoundError';
import { AppError } from '@s/common/error/appError';

export const [errorEndpoint1, errorController1] = [
  '/development/errors/1',
  (_req: express.Request, _res: express.Response) => {
    throw new RecordNotFoundError();
  },
];

export const [errorEndpoint2, errorController2] = [
  '/development/errors/2',
  (_req: express.Request, _res: express.Response) => {
    throw new RecordNotFoundError('データなし');
  },
];

export const [errorEndpoint3, errorController3] = [
  '/development/errors/3',
  (_req: express.Request, _res: express.Response) => {
    throw new AppError(404, 'Apperrorが発生');
  },
];

export const [errorEndpoint4, errorController4] = [
  '/development/errors/4',
  (_req: express.Request, _res: express.Response) => {
    throw new Error('Errorが発生');
  },
];
