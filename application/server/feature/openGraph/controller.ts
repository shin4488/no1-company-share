import express, { Router } from 'express';
import { matchedData } from 'express-validator';
import { openGraphGetRequest } from './definition/openGraphGetRequest';
import { OpenGraphService } from './interface/service';
import { openGraphSimpleValidators } from './simpleValidator';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { BaseController } from '@s/common/controller/baseController';
import { throwIfHasSimpleValidationResult } from '@s/common/middleware/simpleValidationResult';
import { wrapAction } from '@s/common/middleware/controllerCatcher';
import { authorizationFirebaseUser } from '@s/common/middleware/firebaseAuthorization';
import { apiRateLimiter } from '@s/common/middleware/apiRateLimit';

/**
 * 投稿処理に関するコントローラクラス
 */
class OpenGraphController extends BaseController {
  public static openGraphGetEndpoint: string = '/open-graph/';
  public static async getOpenGraph(
    request: express.Request<
      Record<string, any> | undefined,
      null,
      null,
      openGraphGetRequest
    >,
    response: express.Response,
  ) {
    // 配列にそろえた値は、Expressのrequest.queryではなく検査結果から取り出す
    const requestQuery = matchedData<openGraphGetRequest>(request, {
      locations: ['query'],
    });
    const service = appContainer.get<OpenGraphService>(types.OpenGraphService);
    const parameter = {
      pageUris: requestQuery.pageUris || [],
    };
    const responseBody = await service.getOpenGraph(parameter);

    super.success(response, responseBody);
  }
}

const openGraphRouter = Router();
openGraphRouter.get(
  OpenGraphController.openGraphGetEndpoint,
  authorizationFirebaseUser(),
  apiRateLimiter,
  openGraphSimpleValidators,
  throwIfHasSimpleValidationResult,
  wrapAction(OpenGraphController.getOpenGraph),
);
export { openGraphRouter };
