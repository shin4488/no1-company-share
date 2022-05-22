import { body, query } from 'express-validator';
import { Message } from '@s/common/constant/message';
import { StringUtil } from '@c/util/stringUtil';
import { ArrayUtil } from '@c/util/arrayUtil';

const companyNumberLength = 13;
const companyNameLength = 100;
const companyHomePageUrlLength = 2100;
const remarksLength = 500;
const no1ContentLength = 100;
const reportDetailLength = 300;

const sharedPostSaveBaseSimpleValidators = [
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
  // 会社ホームページURLは非必須のため、空時はURLチェックに引っかからないようにする
  body('posts.*.companyHomepageUrl')
    .if((value?: string | null) => StringUtil.isNotEmpty(value))
    .isString()
    .withMessage(`会社ホームページURL:${Message.isString}`)
    .isLength({
      max: companyHomePageUrlLength,
    })
    .withMessage(
      `会社ホームページURL:${Message.maxLength(companyHomePageUrlLength)}`,
    )
    .isURL()
    .withMessage(`会社ホームページURL:${Message.invalidUrl}`),
  body('posts.*.remarks')
    .if((value?: string | null) => StringUtil.isNotEmpty(value))
    .isString()
    .withMessage(`詳細:${Message.isString}`)
    .isLength({
      max: remarksLength,
    })
    .withMessage(`詳細:${Message.maxLength(remarksLength)}`),
  body('posts.*.postDetails')
    .custom((values) => ArrayUtil.isNotEmpty(values))
    .withMessage(`投稿詳細:${Message.notEmpty}`),
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

export const sharedPostGetSimpleValidators = [
  // 取得件数上限は非必須のため、空時はチェックに引っかからないようにする
  // 他のクエリパラメータも同様
  query('limit')
    .if((value?: string | null) => StringUtil.isNotEmpty(value))
    .isNumeric()
    .withMessage(`取得件数上限:${Message.isNumericString}`),
  query('baseDateTime')
    .if((value?: string | null) => StringUtil.isNotEmpty(value))
    .isISO8601()
    .withMessage(`取得基準日時:${Message.isDateTimeFormatString}`),
  query('isMyPostOnly')
    .if((value?: string | null) => StringUtil.isNotEmpty(value))
    .isBoolean()
    .withMessage(`ログインユーザの投稿のみ:${Message.isBoolean}`),
];

export const sharedPostPostSimpleValidators = [
  ...sharedPostSaveBaseSimpleValidators,
];

const sharedPostUpdateBaseSimpleValidators = [
  body('posts.*.id')
    .notEmpty()
    .withMessage(`投稿ID:${Message.notEmpty}`)
    .isString()
    .withMessage(`投稿ID:${Message.isString}`),
];

export const sharedPostPutSimpleValidators = [
  ...sharedPostUpdateBaseSimpleValidators,
  ...sharedPostSaveBaseSimpleValidators,
];

export const sharedPostLogicalDeleteSimpleValidators = [
  ...sharedPostUpdateBaseSimpleValidators,
];

export const reportPostSimpleValidator = [
  ...sharedPostUpdateBaseSimpleValidators,
  body('posts.*.reportDetail')
    .notEmpty()
    .withMessage(`通報理由:${Message.notEmpty}`)
    .isString()
    .withMessage(`通報理由:${Message.isString}`)
    .isLength({
      max: reportDetailLength,
    })
    .withMessage(`通報理由:${Message.maxLength(reportDetailLength)}`),
];
