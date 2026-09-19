import { rateLimit, ipKeyGenerator } from 'express-rate-limit';

// 認証後・DBアクセス前に配置し、プロキシの背後でも認証済みユーザーを区別する。
// 未認証の参照要求だけ接続元IPで数え、転送ヘッダーは信頼しない。
export const apiRateLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  keyGenerator: (request, response) =>
    response.locals.firebaseUserId
      ? `user:${response.locals.firebaseUserId}`
      : `ip:${ipKeyGenerator(
          request.ip || request.socket.remoteAddress || 'unknown',
        )}`,
  message: {
    messages: [
      {
        message:
          'アクセスが集中しています。しばらくしてから再試行してください。',
      },
    ],
  },
});
