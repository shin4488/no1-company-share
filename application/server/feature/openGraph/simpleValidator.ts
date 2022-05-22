import { query } from 'express-validator';
import { Message } from '@s/common/constant/message';

export const openGraphSimpleValidators = [
  query('pageUris.*').isURL().withMessage(Message.invalidUrl),
];
