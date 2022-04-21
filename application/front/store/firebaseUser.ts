// 本当は↓で実装したい（可読性・メンテナンス性のため）
// https://typescript.nuxtjs.org/ja/cookbook/store/#vuex-module-decorators

import { getterTree, mutationTree, actionTree } from 'typed-vuex';

export const state = () => ({
  userId: null as string | null,
});
export type RootState = ReturnType<typeof state>;

export const getters = getterTree(state, {
  userIdComputed(state): string | null {
    return state.userId;
  },
});

export const mutations = mutationTree(state, {
  setUserId(state, userId: string | null) {
    state.userId = userId;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    login({ commit }, userId: string) {
      // TODO:firebase authログイン処理
      commit('setUserId', userId);
    },
    logout({ commit }) {
      // TODO:firebase authログアウト処理
      commit('setUserId', null);
    },
  },
);
