// 本当は↓で実装したい（可読性・メンテナンス性のため）
// https://typescript.nuxtjs.org/ja/cookbook/store/#vuex-module-decorators

import { getterTree, mutationTree, actionTree } from 'typed-vuex';
import { StringUtil } from '@c/util/stringUtil';

export const state = () => ({
  userId: null as string | null,
  idToken: null as string | null,
});
export type RootState = ReturnType<typeof state>;

export const getters = getterTree(state, {
  userIdComputed(state): string | null {
    return state.userId;
  },
  idTokenComputed(state): string | null {
    return state.idToken;
  },
});

export const mutations = mutationTree(state, {
  setUserId(state, userId: string | null) {
    state.userId = userId;
  },
  setIdToken(state, idToken: string | null) {
    state.idToken = idToken;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async onAuthStateChangedAction({ commit }, { authUser }) {
      if (authUser === null) {
        commit('setUserId', null);
        commit('setIdToken', null);
      } else {
        const userId = authUser.uid;
        commit('setUserId', userId);
        // ログイン中でもIDトークンが送られてこない時はfirebaseから取得
        // firebaseから取得できない時に引数でIDトークンを送ってもらう
        const idToken = authUser.idToken;
        const token = StringUtil.isNotEmpty(idToken)
          ? idToken
          : await authUser.getIdToken();
        commit('setIdToken', token);
      }
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
