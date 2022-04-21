import express from 'express';
import { StringUtil } from '@c/util/stringUtil';
import { NotAuthorizedError } from '@s/common/error/notAuthorizedError';

/**
 * Firebase用の認証処理
 */
export const authorizationFirebaseUser = (
  request: express.Request,
  _response: express.Response,
  next: express.NextFunction,
) => {
  const requestMethod = request.method;
  // データ更新系のみ認証チェックを行う
  const isNotGet = requestMethod !== 'GET';
  const firebaseUserId = request.headers.authorization;
  if (isNotGet && StringUtil.isEmpty(firebaseUserId)) {
    throw new NotAuthorizedError();
  }

  next();
};
