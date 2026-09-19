import { IncomingMessage, ServerResponse } from 'http';
import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { firebaseConfig } from '../common/firebaseConfig';

type ResponseWithUser = ServerResponse & { locals?: Record<string, unknown> };

// Service WorkerがHTML要求に付与したIDトークンを、SSRのストア初期化へ渡す。
export default async (
  req: IncomingMessage,
  res: ResponseWithUser,
  next: () => void,
) => {
  const app =
    getApps()[0] || initializeApp({ projectId: firebaseConfig.projectId });
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (token) {
    try {
      const claims = await getAuth(app).verifyIdToken(token);
      if (claims.uid) {
        res.locals = {
          ...res.locals,
          user: {
            uid: claims.uid,
            email: claims.email,
            emailVerified: claims.email_verified,
            displayName: claims.name,
            allClaims: claims,
            idToken: token,
          },
        };
      }
    } catch {
      // 無効なトークンは未認証として扱い、認証必須APIは既存ミドルウェアで拒否する。
    }
  }
  next();
};
