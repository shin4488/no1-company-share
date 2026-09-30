import { createHash, timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';

export const authorizeCompanyUpdate: RequestHandler = (
  request,
  response,
  next,
) => {
  const expected = process.env.COMPANY_UPDATE_SECRET;
  const supplied = request.get('X-Company-Update-Token');
  if (!expected || !supplied) {
    response.sendStatus(403);
    return;
  }

  const expectedHash = createHash('sha256').update(expected).digest();
  const suppliedHash = createHash('sha256').update(supplied).digest();
  if (!timingSafeEqual(expectedHash, suppliedHash)) {
    response.sendStatus(403);
    return;
  }
  next();
};
