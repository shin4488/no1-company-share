<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline"> APIテスト </v-card-title>
        <v-card-text>
          <v-btn color="primary" @click="onClickUserButton">Users</v-btn>
          <v-btn color="primary" @click="onClickCompanyButton">Companies</v-btn>
          <v-btn color="primary" @click="onClickErrorButton">Errors</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="onClickSnackBarErrorButton"
            >SnackBarError</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'HomePage',
  methods: {
    async onClickUserButton() {
      const a = await this.$axios.post('/development/users');
      console.log(a);
    },
    async onClickCompanyButton() {
      const a = await this.$axios.post('/development/companies');
      console.log(a);
    },
    async onClickErrorButton() {
      const a = await this.$axios
        .get('/development/errors/1')
        .catch((error) => error);
      console.log(a);
    },
    onClickSnackBarErrorButton() {
      const message =
        'エラーです！！！ああああああああああ' +
        'いいいいいいいいいいいいいいいいいいいいいいいいいいいいいいい';
      this.$accessor.snackBarError.open(message);
    },
  },
});
</script>
