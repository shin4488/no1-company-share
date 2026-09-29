import { createStore } from 'vuex';
import { defineNuxtPlugin, useState, useRequestEvent } from '#app';
import { getAccessorFromStore } from 'typed-vuex';
import * as firebaseAuthorization from '@f/store/firebaseAuthorization';
import * as snackBarError from '@f/store/snackBarError';
import * as snackBarInfo from '@f/store/snackBarInfo';
import * as spinnerOverlay from '@f/store/spinnerOverlay';

export default defineNuxtPlugin(async (nuxtApp) => {
  const store = createStore({
    modules: {
      firebaseAuthorization: { namespaced: true, ...firebaseAuthorization },
      snackBarError: { namespaced: true, ...snackBarError },
      snackBarInfo: { namespaced: true, ...snackBarInfo },
      spinnerOverlay: { namespaced: true, ...spinnerOverlay },
    },
  });
  const payloadState = useState<typeof store.state>('vuex-state');
  if (typeof window !== 'undefined' && payloadState.value) {
    store.replaceState(payloadState.value);
  }
  if (typeof window === 'undefined') {
    const user = useRequestEvent()?.context.authUser;
    if (user) {
      await store.dispatch('firebaseAuthorization/onAuthStateChangedAction', {
        authUser: user,
      });
    }
    nuxtApp.hook('app:rendered', () => {
      payloadState.value = JSON.parse(JSON.stringify(store.state));
    });
  }
  nuxtApp.vueApp.use(store);
  return {
    provide: {
      accessor: getAccessorFromStore(store)(store),
      store,
    },
  };
});
