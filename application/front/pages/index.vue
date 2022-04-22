<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card class="logo py-4 d-flex justify-center">
        <NuxtLogo />
        <VuetifyLogo />
      </v-card>
      <v-card>
        <v-card-title class="headline"> APIテスト </v-card-title>
        <v-card-text>
          <v-btn color="primary" @click="onClickUserButton">Users</v-btn>
          <v-btn color="primary" @click="onClickCompanyButton">Companies</v-btn>
          <v-btn color="primary" @click="onClickErrorButton">Errors</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/inspire"> Continueああ </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'IndexPage',
  data: () => {
    return {
      message: 'aaaaaa',
    };
  },
  methods: {
    async onClickUserButton() {
      await this.$axios.post('/api/v1/development/users');
    },
    async onClickCompanyButton() {
      await this.$axios.post('/api/v1/development/companies');
    },
    async onClickErrorButton() {
      await this.$axios.post('/api/v1/development/errors');
    },
  },
});
</script>
