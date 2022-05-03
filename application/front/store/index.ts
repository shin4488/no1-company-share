import {
  getAccessorType,
  getterTree,
  mutationTree,
  actionTree,
} from 'typed-vuex';
import * as firebaseAuthorization from './firebaseAuthorization';
import * as snackBarError from './snackBarError';
import * as spinnerOverlay from './spinnerOverlay';

export const state = () => ({});
export const getters = getterTree(state, {});
export const mutations = mutationTree(state, {});
export const actions = actionTree(
  { state, getters, mutations },
  {
    async nuxtServerInit({ dispatch }, { res }) {
      if (res && res.locals && res.locals.user) {
        const authUser = res.locals.user;
        await dispatch('firebaseAuthorization/onAuthStateChangedAction', {
          authUser,
        });
      }
    },
  },
);
export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: {
    firebaseAuthorization,
    snackBarError,
    spinnerOverlay,
  },
});
