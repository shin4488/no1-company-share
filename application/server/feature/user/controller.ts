import express, { Router } from 'express';
import { UserService } from './interface/service';
import { UserSaveRequest } from './definition/userSaveRequest';
import { UserSaveParameter } from './definition/userSaveParameter';
import { userSaveSimpleValidators } from './simpleValidator';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { BaseController } from '@s/common/controller/baseController';
import { authorizationFirebaseUser } from '@s/common/middleware/firebaseAuthorization';
import { StringUtil } from '@c/util/stringUtil';
import { throwIfHasSimpleValidationResult } from '@s/common/middleware/simpleValidationResult';

/**
 * 投稿処理に関するコントローラクラス
 */
class UserController extends BaseController {
  public static userSaveEndpoint: string = '/users/';
  public static async save(
    request: express.Request<
      Record<string, any> | undefined,
      null,
      UserSaveRequest,
      Record<string, any>
    >,
    response: express.Response,
  ) {
    const requestBody = request.body;
    const parameter: UserSaveParameter = {
      id: StringUtil.ifEmpty(response.locals.firebaseUserId),
      iconImageUrl: StringUtil.ifEmpty(requestBody.iconImageUrl),
      displayedName: StringUtil.ifEmpty(requestBody.displayedName),
    };

    const service = appContainer.get<UserService>(types.UserService);
    await service.save(parameter);
    super.success(response);
  }
}

const userRouter = Router();
userRouter.post(
  UserController.userSaveEndpoint,
  authorizationFirebaseUser(),
  userSaveSimpleValidators,
  throwIfHasSimpleValidationResult,
  UserController.save,
);
export { userRouter };
