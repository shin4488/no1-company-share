import express, { Router } from 'express';
import { SharedPostService } from './interface/sharedPostService';
import {
  SharedPostGetRequestQuery,
  SharedPostGetRequestParameter,
} from './definition/sharedPostGetRequest';
import { SharedPostPostRequest } from './definition/sharedPostPostRequest';
import {
  SharedPostPostParameter,
  SharedPostPostParameterItem,
} from './definition/sharedPostPostParameter';
import { SharedPostPostResponse } from './definition/sharedPostPostResponse';
import {
  sharedPostPostSimpleValidators,
  sharedPostPutSimpleValidators,
} from './simpleValidator';
import {
  SharedPostPutRequest,
  SharedPostPutRequestParameter,
} from './definition/sharedPostPutRequest';
import { SharedPostPutResponse } from './definition/sharedPostPutResponse';
import {
  SharedPostPutParameter,
  SharedPostPutParameterItem,
} from './definition/sharedPostPutParameter';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { BaseController } from '@s/common/controller/baseController';
import { authorizationFirebaseUser } from '@s/common/middleware/firebaseAuthorization';
import { StringUtil } from '@c/util/stringUtil';
import { throwIfHasSimpleValidationResult } from '@s/common/middleware/simpleValidationResult';
import { ArrayUtil } from '@c/util/arrayUtil';

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

  public static sharedPostsPostEndpoint: string = '/shared-posts/';
  public static async insert(
    request: express.Request<
      Record<string, any> | undefined,
      SharedPostPostResponse,
      SharedPostPostRequest,
      Record<string, any> | undefined
    >,
    response: express.Response,
  ) {
    const requestBody = request.body;
    const postsParameter: SharedPostPostParameterItem[] =
      requestBody.posts?.map((request) => ({
        key: request.key === undefined ? '' : request.key,
        companyNumber: StringUtil.ifEmpty(request.companyNumber),
        companyName: StringUtil.ifEmpty(request.companyName),
        companyHomepageUrl: StringUtil.ifEmpty(request.companyHomepageUrl),
        remarks: StringUtil.ifEmpty(request.remarks),
        postDetails:
          request.postDetails?.map((detail) => ({
            key: detail.key === undefined ? '' : detail.key,
            no1Content: StringUtil.ifEmpty(detail.no1Content),
            no1Division: StringUtil.ifEmpty(detail.no1Division),
          })) || [],
      })) || [];
    const parameter: SharedPostPostParameter = {
      userId: StringUtil.ifEmpty(response.locals.firebaseUserId),
      posts: postsParameter,
    };

    const service = appContainer.get<SharedPostService>(
      types.SharedPostService,
    );
    const responseDataBody = await service.insert(parameter);
    super.success(response, responseDataBody);
  }

  public static sharedPostsPutEndpoint: string = '/shared-posts/:sharedPostId?';
  public static async update(
    request: express.Request<
      SharedPostPutRequestParameter,
      SharedPostPutResponse,
      SharedPostPutRequest,
      Record<string, any> | undefined
    >,
    response: express.Response,
  ) {
    const requestBody = request.body;
    let postsParameter: SharedPostPutParameterItem[] =
      requestBody.posts?.map((request) => ({
        id: StringUtil.ifEmpty(request.id),
        companyNumber: StringUtil.ifEmpty(request.companyNumber),
        companyName: StringUtil.ifEmpty(request.companyName),
        companyHomepageUrl: StringUtil.ifEmpty(request.companyHomepageUrl),
        remarks: StringUtil.ifEmpty(request.remarks),
        postDetails:
          request.postDetails?.map((detail) => ({
            id: StringUtil.ifEmpty(detail.id),
            no1Content: StringUtil.ifEmpty(detail.no1Content),
            no1Division: StringUtil.ifEmpty(detail.no1Division),
          })) || [],
      })) || [];
    const requestParameter = request.params;
    const targetSharedPostId = requestParameter.sharedPostId;
    if (
      StringUtil.isNotEmpty(targetSharedPostId) &&
      ArrayUtil.isNotEmpty(postsParameter)
    ) {
      postsParameter[0].id = targetSharedPostId as string;
      // 投稿ID指定時には指定された投稿1件のみを更新する
      postsParameter = [postsParameter[0]];
    }

    const parameter: SharedPostPutParameter = {
      userId: StringUtil.ifEmpty(response.locals.firebaseUserId),
      posts: postsParameter,
    };

    const service = appContainer.get<SharedPostService>(
      types.SharedPostService,
    );
    const responseDataBody = await service.update(parameter);
    super.success(response, responseDataBody);
  }
}

const sharedPostRouter = Router();
sharedPostRouter.get(
  SharedPostController.sharedPostsGetEndpoint,
  authorizationFirebaseUser(false),
  SharedPostController.getSharedPosts,
);
sharedPostRouter.post(
  SharedPostController.sharedPostsPostEndpoint,
  authorizationFirebaseUser(),
  sharedPostPostSimpleValidators,
  throwIfHasSimpleValidationResult,
  SharedPostController.insert,
);
sharedPostRouter.put(
  SharedPostController.sharedPostsPutEndpoint,
  authorizationFirebaseUser(),
  sharedPostPutSimpleValidators,
  throwIfHasSimpleValidationResult,
  SharedPostController.update,
);
export { sharedPostRouter };
