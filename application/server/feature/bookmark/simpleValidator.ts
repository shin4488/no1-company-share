import { body, query } from 'express-validator';
import { Message } from '@s/common/constant/message';
import { StringUtil } from '@c/util/stringUtil';

export const bookmarkGetSimpleValidators = [
  query('limit')
    .if((value?: string | null) => StringUtil.isNotEmpty(value))
    .isNumeric()
    .withMessage(`取得件数上限:${Message.isNumericString}`),
  query('baseDateTime')
    .if((value?: string | null) => StringUtil.isNotEmpty(value))
    .isISO8601()
    .withMessage(`取得基準日時:${Message.isDateTimeFormatString}`),
];

const bookmarkBaseSimpleValidators = [
  body('posts.*.id')
    .notEmpty()
    .withMessage(`投稿ID:${Message.notEmpty}`)
    .isString()
    .withMessage(`投稿ID:${Message.isString}`),
];

export const bookmarkPostSimpleValidators = [...bookmarkBaseSimpleValidators];

export const bookmarkDeleteSimpleValidators = [...bookmarkBaseSimpleValidators];
