import { query } from 'express-validator';

export const companySimpleValidators = [
  query('companyName')
    .isString()
    .withMessage('会社名は文字を入力してください。'),
];
