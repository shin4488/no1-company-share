import { mutationTree, actionTree } from 'typed-vuex';

export const state = () => ({
  isShown: false as boolean,
});
export type RootState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  change(state, isShown: boolean) {
    state.isShown = isShown;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async open({ commit }, action: Function) {
      commit('change', true);
      try {
        await action();
      } finally {
        commit('change', false);
      }
    },
  },
);
