import { AppError } from './appError';

/**
 * ログインしていない、またはIDトークンを検証できない時の例外
 */
export class NotAuthorizedError extends AppError {
  constructor() {
    const errorMessage = 'ログインしてください。';
    super(errorMessage);
  }
}
