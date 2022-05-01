import express, { Router } from 'express';
import { openGraphGetRequest } from './definition/openGraphGetRequest';
import { OpenGraphService } from './interface/service';
import { openGraphSimpleValidators } from './simpleValidator';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { BaseController } from '@s/common/controller/baseController';
import { throwIfHasSimpleValidationResult } from '@s/common/middleware/simpleValidationResult';

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
    const requestQuery = request.query;
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
  openGraphSimpleValidators,
  throwIfHasSimpleValidationResult,
  OpenGraphController.getOpenGraph,
);
export { openGraphRouter };
