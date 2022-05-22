import { body } from 'express-validator';
import { Message } from '@s/common/constant/message';

const iconImageUrlMaxLength = 2100;
const displayedNameMaxLenght = 100;

export const userSaveSimpleValidators = [
  body('iconImageUrl')
    .isString()
    .withMessage(`アイコン画像URL:${Message.isString}`)
    .isURL()
    .withMessage(`アイコン画像URL:${Message.invalidUrl}`)
    .isLength({ max: iconImageUrlMaxLength })
    .withMessage(`アイコン画像URL:${Message.maxLength(iconImageUrlMaxLength)}`),
  body('displayedName')
    .isString()
    .withMessage(`ユーザ名:${Message.isString}`)
    .isLength({ max: displayedNameMaxLenght })
    .withMessage(`ユーザ名:${Message.maxLength(displayedNameMaxLenght)}`),
];
