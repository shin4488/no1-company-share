<template>
  <v-snackbar
    v-model="isShownComputed"
    location="top"
    max-width="60%"
    :color="color"
  >
    <div class="text-pre-wrap" v-text="message" />

    <template #actions>
      <v-btn small plain shaped multi-line @click="onClickedCloseButton">
        <v-icon> mdi-close </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SnackBarBase',
  props: {
    modelValue: {
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
  emits: ['update:modelValue'],
  computed: {
    isShownComputed: {
      get(): boolean {
        return this.modelValue;
      },
      set(value: boolean) {
        this.$emit('update:modelValue', value);
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
