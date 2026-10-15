import { query } from 'express-validator';
import { Message } from '@s/common/constant/message';

export const openGraphSimpleValidators = [
  // Expressのクエリ解析では、値が1つだけのときは配列にならない
  query('pageUris')
    .toArray()
    .isArray({ min: 1, max: 3 })
    .bail()
    // 配列の各要素を検査する
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage(Message.invalidUrl)
    .isLength({ max: 2048 }),
];
