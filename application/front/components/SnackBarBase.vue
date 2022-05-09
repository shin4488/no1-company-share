<template>
  <v-snackbar v-model="isShownComputed" top max-width="60%" :color="color">
    <div class="pre-wrap" v-text="message" />

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

export default Vue.extend({
  name: 'SnackBarBase',
  props: {
    value: {
      type: Boolean,
      default: false,
      required: true,
    },
    color: {
      type: String,
      default: '',
      required: false,
    },
    message: {
      type: String,
      default: '',
      required: false,
    },
  },
  computed: {
    isShownComputed: {
      get(): boolean {
        return this.value;
      },
      set(value: boolean) {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    onClickedCloseButton(): void {
      this.isShownComputed = false;
    },
  },
});
</script>

<style lang="sass" scoped>
.pre-wrap
  white-space: pre-wrap
</style>
