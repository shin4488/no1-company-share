import express, { Router } from 'express';
import { DivisionService } from './interface/service';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { BaseController } from '@s/common/controller/baseController';
import { wrapAction } from '@s/common/middleware/controllerCatcher';

/**
 * 投稿処理に関するコントローラクラス
 */
class DivisionController extends BaseController {
  public static no1DivisionSelectItemsGetEndpoint: string = '/divisions/no1';
  public static async getNo1DivisionSelectItems(
    _request: express.Request,
    response: express.Response,
  ) {
    const service = appContainer.get<DivisionService>(types.DivisionService);
    const responseDataBody = await service.getNo1DivisionSelectItems();
    super.success(response, responseDataBody);
  }
}

const divisionRouter = Router();
divisionRouter.get(
  DivisionController.no1DivisionSelectItemsGetEndpoint,
  wrapAction(DivisionController.getNo1DivisionSelectItems),
);
export { divisionRouter };
