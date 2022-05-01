import { query } from 'express-validator';

export const openGraphSimpleValidators = [
  query('pageUris.*').isURL().withMessage('有効なURLを入力してください。'),
];
