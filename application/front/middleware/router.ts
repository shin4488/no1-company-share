import { Context, Middleware } from '@nuxt/types';
import { StringUtil } from '@c/util/stringUtil';

const middlware: Middleware = ({ redirect, route, $accessor }: Context) => {
  // ルートディレクトリはホーム画面に遷移
  const isRootUri = route.path === '/';
  if (isRootUri) {
    redirect('/home');
    return;
  }

  // 未ログイン時はホームのみ表示
  const firebaseLoginUserId = $accessor.firebaseAuthorization.userIdComputed;
  const isNotHomeUri = route.path !== '/home';
  if (StringUtil.isEmpty(firebaseLoginUserId) && isNotHomeUri) {
    redirect('/home');
  }
};

export default middlware;
