import { query } from 'express-validator';
import { Message } from '@s/common/constant/message';

export const openGraphSimpleValidators = [
  query('pageUris').isArray({ min: 1, max: 3 }),
  query('pageUris.*')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage(Message.invalidUrl)
    .isLength({ max: 2048 }),
];
