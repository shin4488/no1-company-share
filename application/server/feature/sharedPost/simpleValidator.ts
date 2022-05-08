import { body, oneOf } from 'express-validator';
import { Message } from '@s/common/constant/message';
import { StringUtil } from '@c/util/stringUtil';

const companyNumberLength = 13;
const companyNameLength = 100;
const companyHomePageUrlLength = 2100;
const remarksLength = 500;
const no1ContentLength = 100;

export const sharedPostBaseSimpleValidators = [
  body('posts.*.companyNumber')
    .notEmpty()
    .withMessage(`法人番号:${Message.notEmpty}`)
    .isString()
    .withMessage(`法人番号:${Message.isString}`)
    .isLength({
      min: companyNumberLength,
      max: companyNumberLength,
    })
    .withMessage(`法人番号:${Message.equalLength(companyNumberLength)}`),
  body('posts.*.companyName')
    .isString()
    .withMessage(`法人名:${Message.isString}`)
    .isLength({
      max: companyNameLength,
    })
    .withMessage(`法人名:${Message.maxLength(companyNameLength)}`),
  oneOf([
    // 会社ホームページURLは非必須のため、空時はURLチェックに引っかからないようにする
    body('posts.*.companyHomepageUrl')
      .custom((value) => StringUtil.isEmpty(value))
      .withMessage(''),
    body('posts.*.companyHomepageUrl')
      .isString()
      .withMessage(`会社ホームページURL:${Message.isString}`)
      .isURL()
      .withMessage(`会社ホームページURL:${Message.invalidUrl}`)
      .isLength({
        max: companyHomePageUrlLength,
      })
      .withMessage(
        `会社ホームページURL:${Message.maxLength(companyHomePageUrlLength)}`,
      ),
  ]),
  body('posts.*.remarks')
    .isString()
    .withMessage(`詳細:${Message.isString}`)
    .isLength({
      max: remarksLength,
    })
    .withMessage(`詳細:${Message.maxLength(remarksLength)}`),
  body('posts.*.postDetails.*.no1Content')
    .notEmpty()
    .withMessage(`No.1の内容:${Message.notEmpty}`)
    .isString()
    .withMessage(`No.1の内容:${Message.isString}`)
    .isLength({
      max: no1ContentLength,
    })
    .withMessage(`No.1の内容:${Message.maxLength(no1ContentLength)}`),
  body('posts.*.postDetails.*.no1Division')
    // 区分値マスタの存在チェックはBL処理側で行う（そのため長さチェックも行わない）
    .notEmpty()
    .withMessage(`No.1区分:${Message.notEmpty}`)
    .isNumeric()
    .withMessage(`No.1区分:${Message.isNumericString}`),
];

export const sharedPostPostSimpleValidators = [
  ...sharedPostBaseSimpleValidators,
];

export const sharedPostPutSimpleValidators = [
  body('posts.*.id').notEmpty().withMessage(`投稿ID:${Message.notEmpty}`),
  ...sharedPostBaseSimpleValidators,
];
