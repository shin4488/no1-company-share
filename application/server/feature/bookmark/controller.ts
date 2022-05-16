import express, { Router } from 'express';
import { BookmarkRequestParameter } from './definition/bookmarkRequestParameter';
import { BookmarkPostRequest } from './definition/bookmarkPostRequest';
import {
  BookmarkPostParameter,
  BookmarkPostParameterItem,
} from './definition/bookmarkPostParameter';
import { BookmarkService } from './interface/service';
import {
  bookmarkDeleteSimpleValidators,
  bookmarkPostSimpleValidators,
} from './simpleValidator';
import { BookmarkDeleteRequest } from './definition/bookmarkDeleteRequest';
import { BookmarkDeleteParameterItem } from './definition/bookmarkDeleteParameter';
import { BookmarkGetResponse } from './definition/bookmarkGetResponse';
import { BookmarkGetRequest } from './definition/bookmarkGetRequest';
import { BookmarkGetParameter } from './definition/bookmarkGetParameter';
import { BaseController } from '@s/common/controller/baseController';
import { StringUtil } from '@c/util/stringUtil';
import { appContainer } from '@s/common/dependencyInjection/inversify.config';
import { types } from '@s/common/dependencyInjection/types';
import { authorizationFirebaseUser } from '@s/common/middleware/firebaseAuthorization';
import { wrapAction } from '@s/common/middleware/controllerCatcher';
import { throwIfHasSimpleValidationResult } from '@s/common/middleware/simpleValidationResult';

/**
 * 投稿処理に関するコントローラクラス
 */
class SharedPostController extends BaseController {
  public static bookmarkGetEndpoint: string = '/bookmarked-posts/:postId?';
  public static async getBookamrks(
    request: express.Request<
      BookmarkRequestParameter,
      BookmarkGetResponse,
      null,
      BookmarkGetRequest
    >,
    response: express.Response,
  ) {
    const query = request.query;
    const requestParameter = request.params;
    const parameter: BookmarkGetParameter = {
      limit: StringUtil.isEmpty(query.limit) ? 100 : Number(query.limit),
      baseDateTime: StringUtil.isEmpty(query.baseDateTime)
        ? null
        : new Date(query.baseDateTime as string),
      postId: StringUtil.ifEmpty(requestParameter.postId),
      userId: StringUtil.ifEmpty(response.locals.firebaseUserId),
    };
    const service = appContainer.get<BookmarkService>(types.BookmarkService);
    const responseBody = await service.getBookmarks(parameter);
    super.success(response, responseBody);
  }

  public static bookmarkPostEndpoint: string = '/bookmarked-posts/:postId?';
  public static async postNewBookmarks(
    request: express.Request<
      BookmarkRequestParameter,
      null,
      BookmarkPostRequest,
      Record<string, any> | undefined
    >,
    response: express.Response,
  ) {
    const parameter: BookmarkPostParameter = {
      posts: [],
      userId: StringUtil.ifEmpty(response.locals.firebaseUserId),
    };
    const requestParameter = request.params;
    const requestParameterPostId = requestParameter.postId;
    // URIにお気に入り対象の投稿IDがあれば、リクエストボディよりもURIの方を優先する
    if (StringUtil.isNotEmpty(requestParameterPostId)) {
      parameter.posts.push({
        id: requestParameterPostId as string,
      });
    } else {
      const body = request.body;
      const bodyPosts = body.posts;
      parameter.posts =
        bodyPosts?.map<BookmarkPostParameterItem>((x) => ({
          id: StringUtil.ifEmpty(x.id),
        })) || [];
    }

    const service = appContainer.get<BookmarkService>(types.BookmarkService);
    await service.postNewBookmarks(parameter);
    super.success(response);
  }

  public static bookmarkDeleteEndpoint: string = '/bookmarked-posts/:postId?';
  public static async deleteBookmarks(
    request: express.Request<
      BookmarkRequestParameter,
      null,
      BookmarkDeleteRequest,
      Record<string, any> | undefined
    >,
    response: express.Response,
  ) {
    const parameter: BookmarkPostParameter = {
      posts: [],
      userId: StringUtil.ifEmpty(response.locals.firebaseUserId),
    };
    const requestParameter = request.params;
    const requestParameterPostId = requestParameter.postId;
    // URIにお気に入り対象の投稿IDがあれば、リクエストボディよりもURIの方を優先する
    if (StringUtil.isNotEmpty(requestParameterPostId)) {
      parameter.posts.push({
        id: requestParameterPostId as string,
      });
    } else {
      const body = request.body;
      const bodyPosts = body.posts;
      parameter.posts =
        bodyPosts?.map<BookmarkDeleteParameterItem>((x) => ({
          id: StringUtil.ifEmpty(x.id),
        })) || [];
    }

    const service = appContainer.get<BookmarkService>(types.BookmarkService);
    await service.deleteBookmarks(parameter);
    super.success(response);
  }
}

const bookmarkRouter = Router();
bookmarkRouter.get(
  SharedPostController.bookmarkGetEndpoint,
  authorizationFirebaseUser(false),
  // bookmarkGetSimpleValidators,
  // throwIfHasSimpleValidationResult,
  wrapAction(SharedPostController.getBookamrks),
);
bookmarkRouter.post(
  SharedPostController.bookmarkPostEndpoint,
  authorizationFirebaseUser(),
  bookmarkPostSimpleValidators,
  throwIfHasSimpleValidationResult,
  wrapAction(SharedPostController.postNewBookmarks),
);
bookmarkRouter.delete(
  SharedPostController.bookmarkDeleteEndpoint,
  authorizationFirebaseUser(),
  bookmarkDeleteSimpleValidators,
  throwIfHasSimpleValidationResult,
  wrapAction(SharedPostController.deleteBookmarks),
);
export { bookmarkRouter };
