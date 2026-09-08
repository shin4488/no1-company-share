import { Context, Plugin } from '@nuxt/types';
import { AxiosResponse } from 'axios';
import {
  AppResponse,
  AppMessageResponse,
} from '@f/definition/plugins/ajaxResponse';
import { ArrayUtil } from '@c/util/arrayUtil';

/**
 * レスポンスからエラーメッセージの取得
 * メッセージがない場合はnullを返却
 */
const extractErrorMessageIfExists = (
  responseBody: AppResponse,
): string | null => {
  const messageObjects = responseBody.messages;
  if (ArrayUtil.isEmpty(messageObjects)) {
    return null;
  }

  const messages = messageObjects.map((x: AppMessageResponse) => x.message);
  const joinedMessage = messages.join('\n');
  return joinedMessage;
};

const plugin: Plugin = ({ $axios, $accessor }: Context) => {
  $axios.onRequest((config) => {
    const headers = config.headers as Record<string, string | null>;
    headers.Authorization = $accessor.firebaseAuthorization.idTokenComputed;
    return config;
  });
  $axios.onResponse((response: AxiosResponse<AppResponse>) => {
    // 200で返ってきてもメッセージが含まれていればエラーメッセージとして表示
    const responseBody = response.data as AppResponse;
    const joinedMessage = extractErrorMessageIfExists(responseBody);
    if (joinedMessage !== null) {
      $accessor.snackBarError.open(joinedMessage);
    }
  });
  $axios.onResponseError((error) => {
    const response = error.response;
    if (response === undefined) {
      return;
    }

    const responseBody = response.data as AppResponse;
    const joinedMessage = extractErrorMessageIfExists(responseBody);
    if (joinedMessage !== null) {
      $accessor.snackBarError.open(joinedMessage);
    }
  });
};

export default plugin;
