<template>
  <v-progress-circular
    v-if="show"
    indeterminate
    color="primary"
  ></v-progress-circular>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
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
