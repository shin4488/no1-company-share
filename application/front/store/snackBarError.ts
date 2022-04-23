import { mutationTree, actionTree } from 'typed-vuex';

export const state = () => ({
  message: '' as string,
});
export type RootState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  open(state, message: string) {
    state.message = message;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    open({ commit }, message: string) {
      commit('open', message);
    },
  },
);
