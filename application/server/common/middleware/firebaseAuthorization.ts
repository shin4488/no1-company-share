import express from 'express';
import admin from 'firebase-admin';
import { StringUtil } from '@c/util/stringUtil';
import { NotAuthorizedError } from '@s/common/error/notAuthorizedError';

/**
 * Firebase用の認証処理
 */
export const authorizationFirebaseUser = async (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) => {
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
    // GETリクエストであってもログイン中であればユーザIDを取得する
    // 自分の投稿かどうか、お気に入り済みかどうかを判定するため
    response.locals.firebaseUserId = firebaseUserId;
    next();
  } catch {
    const error = new NotAuthorizedError();
    next(error);
  }
};
