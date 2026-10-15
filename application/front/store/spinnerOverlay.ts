import { defineStore } from 'pinia';

export const useSpinnerOverlayStore = defineStore('spinnerOverlay', {
  state: () => ({
    isShown: false as boolean,
  }),
  actions: {
    async open(action: () => unknown) {
      // actionを実行中のみスピナーをオン、実行後はオフとする
      this.isShown = true;
      try {
        await action();
      } finally {
        this.isShown = false;
      }
    },
  },
});
