import express from 'express';

interface PromiseRequestAction {
  (request: express.Request, response: express.Response): Promise<unknown>;
}

/**
 * 非同期処理中に例外発生した際にキャッチするためのラッパー
 * @param controllerAction
 * @returns
 */
const wrapAction = (controllerAction: PromiseRequestAction) => {
  return (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction,
  ): Promise<unknown> =>
    controllerAction(request, response).catch((error: Error) => next(error));
};

export { wrapAction };
