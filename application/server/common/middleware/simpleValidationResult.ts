import express from 'express';
import { validationResult } from 'express-validator';
import { BadParameterError } from '@s/common/error/badParameterError';

export const throwIfHasSimpleValidationResult = (
  request: express.Request,
  _response: express.Response,
  next: express.NextFunction,
) => {
  const validationRrror = validationResult(request);
  if (validationRrror.isEmpty()) {
    next();
    return;
  }

  const errors = validationRrror.array();
  const errorMessages = errors.map<string>((x) => x.msg);
  const error = new BadParameterError(...errorMessages);
  next(error);
};
