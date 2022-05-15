import { body } from 'express-validator';
import { Message } from '@s/common/constant/message';

const bookmarkBaseSimpleValidators = [
  body('posts.*.id')
    .notEmpty()
    .withMessage(`投稿ID:${Message.notEmpty}`)
    .isString()
    .withMessage(`投稿ID:${Message.isString}`),
];

export const bookmarkPostSimpleValidators = [...bookmarkBaseSimpleValidators];

export const bookmarkDeleteSimpleValidators = [...bookmarkBaseSimpleValidators];
