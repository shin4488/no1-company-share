import { Context, Middleware } from '@nuxt/types';

const middlware: Middleware = ({ redirect, route }: Context) => {
  // ルートディレクトリはホーム画面に遷移
  const isHomeUri = route.path === '/';
  if (isHomeUri) {
    redirect('/home');
  }
};

export default middlware;
