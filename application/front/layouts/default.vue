<template>
  <!-- https://vuetifyjs.com/ja/getting-started/wireframes/ -->
  <v-app>
    <template v-if="!shouldUseBottomBarComputed">
      <v-app-bar clipped-left fixed dense app>
        <v-app-bar-nav-icon @click.stop="onClickedNavigationBar" />
        <v-toolbar-title v-text="title" />
      </v-app-bar>

      <!-- mini-variant:アイコンのみナビゲーション表示 -->
      <!-- clipped:app-barの下にナビゲーション表示 -->
      <v-navigation-drawer
        v-model="isDrawerOpened"
        :mini-variant="isDrawerMini"
        width="200"
        clipped
        permanent
        fixed
        app
      >
        <v-list>
          <v-list-item
            v-for="(item, i) in navigationItems"
            :key="i"
            :to="item.to"
            :title="item.title"
            router
            exact
            @click="onClickedListItem(item.to)"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </template>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <!-- ボトムナビゲーション->モバイルのみ -->
    <template v-if="shouldUseBottomBarComputed">
      <v-bottom-navigation app fixed :value="0" color="primary">
        <v-slide-group>
          <v-btn
            v-for="(item, index) in navigationItems"
            :key="index"
            :to="item.to"
            @click="onClickedListItem(item.to)"
          >
            <span>{{ item.title }}</span>
            <v-icon>{{ item.icon }}</v-icon>
          </v-btn>
        </v-slide-group>
      </v-bottom-navigation>
    </template>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DefaultLayout',
  data() {
    return {
      isDrawerOpened: true,
      isDrawerMini: true,
      title: 'F1C',
      // https://materialdesignicons.com/
      logoutItems: [
        {
          icon: 'mdi-login',
          title: 'ログイン',
          to: '#login',
        },
      ],
      logginedItems: [
        {
          icon: 'mdi-home-variant-outline',
          title: 'ホーム',
          to: '/',
        },
        {
          icon: 'mdi-star',
          title: 'お気に入り',
          to: '/',
        },
        {
          icon: 'mdi-account',
          title: 'マイポスト',
          to: '/inspire',
        },
        {
          icon: 'mdi-logout',
          title: 'ログアウト',
          to: '#logout',
        },
      ],
    };
  },
  computed: {
    navigationItems(): Record<string, string>[] {
      const hasUserId =
        this.$accessor.firebaseAuthorization.userIdComputed !== null;
      return hasUserId ? this.logginedItems : this.logoutItems;
    },
    shouldUseBottomBarComputed(): boolean {
      return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm;
    },
  },
  methods: {
    onClickedNavigationBar(): void {
      this.isDrawerMini = !this.isDrawerMini;
    },
    async onClickedListItem(path: string): Promise<void> {
      const isLoginPath = path === '#login';
      const isLogoutPath = path === '#logout';
      if (!(isLoginPath || isLogoutPath)) {
        const loginUserId = this.$accessor.firebaseAuthorization.userIdComputed;
        const res = await this.$axios.get('/api/v1/development/users', {
          headers: {
            Authorization: loginUserId,
          },
        });
        console.log(res);
        return;
      }

      console.log(this.$accessor.firebaseAuthorization.userIdComputed);
      if (isLoginPath) {
        await this.$accessor.firebaseAuthorization.loginByGoogle();
      } else {
        await this.$accessor.firebaseAuthorization.logout();
      }
    },
  },
});
</script>
