import { Context, Plugin } from '@nuxt/types';

const plugin: Plugin = ({ $axios, $accessor }: Context) => {
  $axios.onRequest((config) => {
    config.headers.Authorization =
      $accessor.firebaseAuthorization.idTokenComputed;
    return config;
  });
  $axios.onResponseError((error) => {
    // TODO:スナックバーでのエラーメッセージ表示
    console.log(error);
  });
};

export default plugin;
