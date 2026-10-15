import { defineStore } from 'pinia';

export const useSnackBarErrorStore = defineStore('snackBarError', {
  state: () => ({
    message: '' as string,
  }),
  actions: {
    open(message: string) {
      this.message = message;
    },
  },
});
