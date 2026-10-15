import { defineStore } from 'pinia';

export const useSnackBarInfoStore = defineStore('snackBarInfo', {
  state: () => ({
    message: '' as string,
  }),
  actions: {
    open(message: string) {
      this.message = message;
    },
  },
});
