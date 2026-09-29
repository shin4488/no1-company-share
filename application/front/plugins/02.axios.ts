import { create, type AxiosResponse } from 'axios';
import { defineNuxtPlugin, useRequestEvent } from '#app';
import type {
  AppResponse,
  AppMessageResponse,
} from '@f/definition/plugins/ajaxResponse';
import { ArrayUtil } from '@c/util/arrayUtil';

export default defineNuxtPlugin((nuxtApp) => {
  const { $accessor, $store } = nuxtApp;
  const localPort = useRequestEvent()?.node.req.socket.localPort;
  const api = create({
    baseURL:
      typeof window === 'undefined'
        ? `http://127.0.0.1:${localPort || process.env.PORT || 3000}/api/v1`
        : '/api/v1',
  });
  const notify = (body: AppResponse) => {
    if (!ArrayUtil.isEmpty(body?.messages)) {
      $accessor.snackBarError.open(
        body.messages
          .map((item: AppMessageResponse) => item.message)
          .join('\n'),
      );
    }
  };
  api.interceptors.request.use((config) => {
    const token = $accessor.firebaseAuthorization.idTokenComputed;
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  });
  api.interceptors.response.use(
    (response: AxiosResponse<AppResponse>) => {
      notify(response.data);
      return response;
    },
    (error) => {
      if (error.response) {
        notify(error.response.data);
        if (ArrayUtil.isEmpty(error.response.data?.messages)) {
          $accessor.snackBarError.open(
            `${error.response.status} : 通信に失敗しました。再試行してください。`,
          );
        }
      } else {
        $accessor.snackBarError.open(
          '通信に失敗しました。接続を確認して再試行してください。',
        );
      }
      return Promise.reject(error);
    },
  );
  $store.$axios = api;
  return { provide: { axios: api } };
});
