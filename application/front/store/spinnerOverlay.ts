import { defineStore } from 'pinia';

export const useSpinnerOverlayStore = defineStore('spinnerOverlay', {
  state: () => ({
    isShown: false as boolean,
  }),
  actions: {
    async open(action: () => unknown) {
      this.isShown = true;
      try {
        await action();
      } finally {
        this.isShown = false;
      }
    },
  },
});
