// 本当は↓で実装したい（可読性・メンテナンス性のため）
// https://typescript.nuxtjs.org/ja/cookbook/store/#vuex-module-decorators

import { getterTree, mutationTree, actionTree } from 'typed-vuex';
import { UserPostRequest } from './definition/firebaseAuthorization/userPostRequest';
import { firebaseUserInfo } from './definition/firebaseAuthorization/data';
import { StringUtil } from '@c/util/stringUtil';
import { AjaxHelper } from '@f/common/ajax/ajaxHelper';

export const state = (): firebaseUserInfo => ({
  userId: null as string | null,
  idToken: null as string | null,
  iconImageUrl: null as string | null,
  displayedName: null as string | null,
});
export type RootState = ReturnType<typeof state>;

export const getters = getterTree(state, {
  userIdComputed(state): string | null {
    return state.userId;
  },
  idTokenComputed(state): string | null {
    return state.idToken;
  },
  userInfoComputed(state): firebaseUserInfo {
    return {
      userId: state.userId,
      idToken: state.idToken,
      iconImageUrl: state.iconImageUrl,
      displayedName: state.displayedName,
    };
  },
});

export const mutations = mutationTree(state, {
  setUserInfo(
    state,
    { userId, idToken, iconImageUrl, displayedName }: firebaseUserInfo,
  ) {
    state.userId = userId;
    state.idToken = idToken;
    state.iconImageUrl = iconImageUrl;
    state.displayedName = displayedName;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async onAuthStateChangedAction({ commit }, { authUser }) {
      if (authUser === null) {
        commit('setUserInfo', {
          userId: null,
          idToken: null,
          iconImageUrl: null,
          displayedName: null,
        });
        return;
      }

      // ログイン中でもIDトークンが送られてこない時はfirebaseから取得
      // firebaseから取得できない時に引数でIDトークンを送ってもらう
      const idToken = authUser.idToken;
      const token = StringUtil.isNotEmpty(idToken)
        ? idToken
        : await authUser.getIdToken();
      const claims = authUser.allClaims;
      const hasClaims = claims !== undefined;
      const iconImageUrl = hasClaims ? claims.picture : authUser.photoURL;
      const displayedName = hasClaims ? claims.name : authUser.displayName;
      commit('setUserInfo', {
        userId: authUser.uid,
        idToken: token,
        iconImageUrl,
        displayedName,
      });
      if (this.$axios === undefined) {
        return;
      }

      // ブラウザからのfirebaseユーザ削除や、別アプリ側でのユーザ名・アイコン画像変更に対応するため、
      // 画面初期表示の都度ユーザ情報を更新する
      const requestBody: UserPostRequest = {
        iconImageUrl,
        displayedName,
      };
      AjaxHelper.post(this.$axios, '/users/', requestBody);
    },
    async loginByGoogle() {
      const provider = new this.$fireModule.auth.GoogleAuthProvider();
      // ポップアップを閉じたときのエラー回避のためcatchを記載
      await this.$fire.auth.signInWithPopup(provider).catch((error) => error);
    },
    async logout() {
      await this.$fire.auth.signOut();
    },
  },
);
