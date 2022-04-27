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
export const actions = actionTree({ state, getters, mutations }, {});
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
