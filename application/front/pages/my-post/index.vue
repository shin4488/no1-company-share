<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="logo py-4 d-flex justify-center">
        this is my post component.
        <input v-model="message" type="text" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'MyPostPage',
  data: () => {
    return {
      message: 'aaaaaa',
    };
  },
});
</script>
