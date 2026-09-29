import express from 'express';
import { getAuth } from 'firebase-admin/auth';
import { NotAuthorizedError } from '@s/common/error/notAuthorizedError';

/**
 * Firebase用の認証処理
 */
export const authorizationFirebaseUser = (shouldThrowError: boolean = true) => {
  return async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ) => {
    // 現行クライアントの Bearer 形式と旧クライアントの生トークンを受け付ける。
    const token = (request.headers.authorization || '').replace(
      /^Bearer /i,
      '',
    );
    // デコードできない時は例外が発生する
    try {
      const firebaseDecodedToken = await getAuth().verifyIdToken(token);
      const firebaseUserId = firebaseDecodedToken?.uid;
      // GETリクエストであってもログイン中であればユーザIDを取得する
      // 自分の投稿かどうか、お気に入り済みかどうかを判定するため
      response.locals.firebaseUserId = firebaseUserId;
      next();
    } catch {
      if (shouldThrowError) {
        const error = new NotAuthorizedError();
        next(error);
      } else {
        next();
      }
    }
  };
};
