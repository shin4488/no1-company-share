<template>
  <v-btn
    dark
    fab
    bottom
    right
    color="primary"
    fixed
    :class="additionButtonClassComputed"
    @click="onClickedAddButton"
  >
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'AddIconFixedButton',
  computed: {
    additionButtonClassComputed(): string {
      return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm
        ? // 追加ボタンでカード側のアイコンボタンが押せなくなるのを防ぐため、マージンを設定
          'mb-16'
        : 'mb-10';
    },
  },
  methods: {
    onClickedAddButton(): void {
      this.$emit('click');
    },
  },
});
</script>
