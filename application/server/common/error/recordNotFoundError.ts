import { AppError } from './appError';

/**
 * データベースにレコードが存在しない時の例外
 */
export class RecordNotFoundError extends AppError {
  constructor(message?: string) {
    const errorMessage = message || 'データが存在しません。';
    super(errorMessage);
  }
}
