import express, { Router } from 'express';
import { SharedPostService } from './interface/sharedPostService';
import {
  SharedPostGetRequestQuery,
  SharedPostGetRequestParameter,
} from './definition/sharedPostGetRequest';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { BaseController } from '@s/common/controller/baseController';

/**
 * 投稿処理に関するコントローラクラス
 */
class SharedPostController extends BaseController {
  public static sharedPostsGetEndpoint: string = '/shared-posts/:postId?';
  public static async getSharedPosts(
    request: express.Request<
      SharedPostGetRequestParameter,
      null,
      null,
      SharedPostGetRequestQuery
    >,
    response: express.Response,
  ) {
    const requestQuery = request.query;
    const requestParameter = request.params;
    console.log(requestQuery);
    console.log(requestParameter);
    const service = appContainer.get<SharedPostService>(
      types.SharedPostService,
    );
    const responseDataBody = await service.getSharedPosts();
    super.success(response, responseDataBody);
  }
}

const sharedPostRouter = Router();
sharedPostRouter.get(
  SharedPostController.sharedPostsGetEndpoint,
  SharedPostController.getSharedPosts,
);
export { sharedPostRouter };
