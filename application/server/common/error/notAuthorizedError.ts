import { AppError } from './appError';

/**
 * データベースにレコードが存在しない時の例外
 */
export class NotAuthorizedError extends AppError {
  constructor() {
    // エラーメッセージは固定
    const errorMessage = 'ログインしてください。';
    super(401, errorMessage);
  }
}
