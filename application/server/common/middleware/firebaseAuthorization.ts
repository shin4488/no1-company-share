import express from 'express';
import admin from 'firebase-admin';
import { StringUtil } from '@c/util/stringUtil';
import { NotAuthorizedError } from '@s/common/error/notAuthorizedError';

/**
 * Firebase用の認証処理
 */
export const authorizationFirebaseUser = async (
  request: express.Request,
  _response: express.Response,
  next: express.NextFunction,
) => {
  // データ更新系のみ認証チェックを行う
  const requestMethod = request.method;
  const isGet = requestMethod === 'GET';
  if (isGet) {
    next();
    return;
  }

  const firebaseIdToken = request.headers.authorization;
  const token =
    StringUtil.isEmpty(firebaseIdToken) ||
    firebaseIdToken === 'null' ||
    firebaseIdToken === 'undefined'
      ? ''
      : firebaseIdToken || '';
  // デコードできない時は例外が発生する
  try {
    const firebaseDecodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUserId = firebaseDecodedToken?.uid;
    next();
  } catch {
    const error = new NotAuthorizedError();
    next(error);
  }
};
