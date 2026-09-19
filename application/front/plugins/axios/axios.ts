import { Plugin } from '@nuxt/types';
import { create, AxiosResponse } from 'axios';
import {
  AppResponse,
  AppMessageResponse,
} from '@f/definition/plugins/ajaxResponse';
import { ArrayUtil } from '@c/util/arrayUtil';

const plugin: Plugin = ({ $accessor }, inject) => {
  const api = create({
    baseURL: process.server
      ? `http://127.0.0.1:${process.env.NUXT_PORT || 3000}/api/v1`
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
    config.headers.set(
      'Authorization',
      $accessor.firebaseAuthorization.idTokenComputed,
    );
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
      }
      return Promise.reject(error);
    },
  );
  inject('axios', api);
};
export default plugin;
