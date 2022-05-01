<template>
  <v-progress-circular
    v-if="show"
    indeterminate
    color="primary"
  ></v-progress-circular>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'AppSpinner',
  props: {
    show: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
});
</script>
