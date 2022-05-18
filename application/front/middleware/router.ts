import { Context, Middleware } from '@nuxt/types';
import { StringUtil } from '@c/util/stringUtil';

const middlware: Middleware = ({ redirect, route, $accessor }: Context) => {
  // ルートディレクトリ・ログイン状態変更時はホーム画面に遷移
  const homeRedirectPaths = ['/', '/login', '/logout'];
  const shouldRouteToHome = homeRedirectPaths.includes(route.path);
  if (shouldRouteToHome) {
    redirect('/home');
    return;
  }

  // 未ログイン時は「ホーム」「使い方」以外の時はリダイレクト
  const firebaseLoginUserId = $accessor.firebaseAuthorization.userIdComputed;
  const notNeedRedirectPaths = ['/home', '/usage'];
  const isNeedRedirect = !notNeedRedirectPaths.includes(route.path);
  if (StringUtil.isEmpty(firebaseLoginUserId) && isNeedRedirect) {
    redirect('/home');
  }
};

export default middlware;
