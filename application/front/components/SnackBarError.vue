<template>
  <v-snackbar v-model="isShown" top max-width="60%" color="error">
    {{ message }}

    <template #action="{ attrs }">
      <v-btn
        small
        plain
        shaped
        multi-line
        v-bind="attrs"
        @click="onClickedCloseButton"
      >
        <v-icon> mdi-close </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { SnackBarErrorData } from '@f/definition/components/snackBarError/snackBarErrorData';

export default Vue.extend({
  name: 'SnackBarError',
  data(): SnackBarErrorData {
    return {
      isShown: false,
      message: '',
    };
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackBarError/open') {
        this.message = state.snackBarError.message;
        this.isShown = true;
      }
    });
  },
  methods: {
    onClickedCloseButton(): void {
      this.isShown = false;
    },
  },
});
</script>
