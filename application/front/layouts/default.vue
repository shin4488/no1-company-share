<template>
  <!-- https://vuetifyjs.com/ja/getting-started/wireframes/ -->
  <v-app>
    <SnackBarError></SnackBarError>

    <template v-if="!shouldUseBottomBarComputed">
      <v-app-bar clipped-left fixed dense app>
        <v-app-bar-nav-icon @click.stop="onClickedNavigationBar" />
        <v-toolbar-title
          class="app-toobar-title"
          @click="routeToHome"
          v-text="title"
        />
      </v-app-bar>

      <!-- mini-variant:アイコンのみナビゲーション表示 -->
      <!-- clipped:app-barの下にナビゲーション表示 -->
      <v-navigation-drawer
        v-model="isDrawerOpened"
        :mini-variant="isDrawerMini"
        width="190"
        clipped
        permanent
        fixed
        app
      >
        <v-list shaped>
          <v-list-item
            v-for="(item, index) in sideBarItems"
            :key="index"
            :to="item.to"
            :title="item.title"
            router
            exact
            nuxt
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
            v-for="(item, index) in sideBarItems"
            :key="index"
            :to="item.to"
            nuxt
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
import {
  DefaultData,
  SidebarItem,
} from '@f/definition/layouts/default/defaultData';
import { StringUtil } from '@c/util/stringUtil';
import SnackBarError from '@f/components/SnackBarError.vue';

export default Vue.extend({
  name: 'DefaultLayout',
  components: {
    SnackBarError,
  },
  data(): DefaultData {
    return {
      isDrawerOpened: true,
      isDrawerMini: false,
      title: 'F1C',
      // https://materialdesignicons.com/
      sideBarItems: [
        {
          icon: '',
          title: '',
          to: '',
        },
      ],
    };
  },
  computed: {
    homePath: (): string => '/home',
    loginPath: (): string => '#login',
    logoutPath: (): string => '#logout',
    /**
     * ログアウト状態でのサイドバーメニュー
     */
    logoutSideBarItems(): SidebarItem[] {
      return [
        {
          icon: 'mdi-login',
          title: 'ログイン',
          // ログイン画面はfirebaseのポップアップとなるが、ログインボタン押下判定のために「#」を付与
          to: this.loginPath,
        },
      ];
    },
    /**
     * ログイン状態でのサイドバーメニュー
     */
    logginedSidebarItems(): SidebarItem[] {
      return [
        {
          icon: 'mdi-home-variant-outline',
          title: 'ホーム',
          to: this.homePath,
        },
        {
          icon: 'mdi-star',
          title: 'お気に入り',
          to: '/bookmark',
        },
        {
          icon: 'mdi-account',
          title: 'マイ投稿',
          to: '/my-post',
        },
        {
          icon: 'mdi-logout',
          title: 'ログアウト',
          // ログアウトしつつホームに戻る
          to: this.logoutPath,
        },
      ];
    },
    firebaseUserId(): string | null {
      return this.$accessor.firebaseAuthorization.userIdComputed;
    },
    shouldUseBottomBarComputed(): boolean {
      return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm;
    },
  },
  watch: {
    // ログイン状態が変わればサイドバー表示内容も変更
    firebaseUserId(updatedUserId) {
      this.sideBarItems = this.decideSidebarItems(updatedUserId);

      // ミドルウェアでリダイレクトしたいが、
      // ミドルウェア内ではfirebaseユーザIDが（ログイン状態でも）nullになってしまうためここでルーティング
      this.routeToHomeIfNotLoggedin();
    },
  },
  mounted() {
    // TODO:本当はsideBarItemsはdataではなくcomputedを使用したいが、computedでstoreにアクセスすると以下エラーとなるためmountedを使用
    // The client-side rendered virtual DOM tree is not matching server-rendered content.
    const firebaseUserId = this.$accessor.firebaseAuthorization.userIdComputed;
    this.sideBarItems = this.decideSidebarItems(firebaseUserId);
    this.routeToHomeIfNotLoggedin();
  },
  methods: {
    decideSidebarItems(firebaseUserId: string | null): SidebarItem[] {
      return StringUtil.isEmpty(firebaseUserId)
        ? this.logoutSideBarItems
        : this.logginedSidebarItems;
    },
    routeToHomeIfNotLoggedin(): void {
      // ユーザIDが存在しない場合を未認証状態とみなす
      // ホーム画面のみ、未認証でも閲覧可能
      if (StringUtil.isEmpty(this.firebaseUserId)) {
        this.routeToHome();
      }
    },
    routeToHome(): void {
      this.$router.push(this.homePath);
    },
    onClickedNavigationBar(): void {
      this.isDrawerMini = !this.isDrawerMini;
    },
    async onClickedListItem(path: string): Promise<void> {
      const isLoginPath = path === this.loginPath;
      const isLogoutPath = path === this.logoutPath;
      if (!(isLoginPath || isLogoutPath)) {
        return;
      }

      if (isLoginPath) {
        await this.$accessor.firebaseAuthorization.loginByGoogle();
      } else {
        await this.$accessor.firebaseAuthorization.logout();
      }
    },
  },
});
</script>

<style lang="sass" scoped>
.app-toobar-title
  cursor: pointer
</style>
