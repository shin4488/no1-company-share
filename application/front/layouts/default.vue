<template>
  <!-- https://vuetifyjs.com/ja/getting-started/wireframes/ -->
  <v-app>
    <SnackBarError />
    <SnackBarInfo />
    <SpinnerOverlay />

    <template v-if="!shouldUseBottomBarComputed">
      <v-app-bar clipped-left fixed dense app>
        <v-app-bar-nav-icon @click.stop="onClickedNavigationBar" />
        <v-toolbar-title
          class="app-toobar-title"
          @click="routeToHome"
          v-text="title"
        />
        <v-spacer></v-spacer>
        <v-list-item-avatar v-if="isLogined" dense>
          <v-img class="elevation-6" :src="firebaseUserIconImage"></v-img>
        </v-list-item-avatar>
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
      <v-bottom-navigation app fixed>
        <v-slide-group :value="selectedSideBarItem">
          <v-slide-item
            v-for="(item, index) in sideBarItems"
            :key="index"
            v-slot="{ active }"
          >
            <v-btn
              :to="item.to"
              :input-value="active"
              :color="active ? 'primary' : ''"
              text
              nuxt
            >
              <span>{{ item.title }}</span>
              <v-icon>{{ item.icon }}</v-icon>
            </v-btn>
          </v-slide-item>

          <v-list-item-avatar v-if="isLogined" dense>
            <v-img class="elevation-6" :src="firebaseUserIconImage"></v-img>
          </v-list-item-avatar>
        </v-slide-group>
      </v-bottom-navigation>
    </template>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import { DefaultData, SidebarItem } from '@f/definition/layouts/default/data';
import { StringUtil } from '@c/util/stringUtil';

export default Vue.extend({
  name: 'DefaultLayout',
  data(): DefaultData {
    return {
      isDrawerOpened: true,
      isDrawerMini: false,
      title: 'F1C',
      firebaseUserIconImage: '',
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
    loginPath: (): string => '/login',
    logoutPath: (): string => '/logout',
    usagePath: (): string => '/usage',
    /**
     * ログアウト状態でのサイドバーメニュー
     */
    logoutSideBarItems(): SidebarItem[] {
      return [
        {
          icon: 'mdi-home-variant-outline',
          title: 'ホーム',
          to: this.homePath,
        },
        {
          icon: 'mdi-login',
          title: 'ログイン',
          // ログイン画面はfirebaseのポップアップとなるが、ログインボタン押下判定のために「#」を付与
          to: this.loginPath,
        },
        {
          icon: 'mdi-book-open-variant',
          title: '使い方',
          to: this.usagePath,
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
          icon: 'mdi-heart',
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
        {
          icon: 'mdi-book-open-variant',
          title: '使い方',
          to: this.usagePath,
        },
      ];
    },
    isLogined(): boolean {
      return StringUtil.isNotEmpty(this.firebaseUserId);
    },
    firebaseUserId(): string | null {
      return this.$accessor.firebaseAuthorization.userIdComputed;
    },
    shouldUseBottomBarComputed(): boolean {
      return this.$vuetify.breakpoint.xs || this.$vuetify.breakpoint.sm;
    },
    selectedSideBarItem(): number {
      const selectedSideBarIndex = this.sideBarItems.findIndex(
        (x) => x.to === this.$nuxt.$route.path,
      );
      return selectedSideBarIndex === -1 ? 0 : selectedSideBarIndex;
    },
  },
  watch: {
    // ログイン状態が変わればサイドバー表示内容も変更
    async firebaseUserId() {
      this.firebaseUserIconImage =
        this.$fireModule.auth().currentUser?.photoURL || '';
      this.sideBarItems = this.$cloner.deepClone(this.decideSidebarItems());

      // homeはルーティング時にhomeのままであり、画面更新されないため、
      // ログイン状態が変わったら、お気に入り状態の再取得のために明示的にデータを取得しなおす
      if (this.$nuxt.$route.path === '/home') {
        await this.$nuxt.refresh();
      }
    },
  },
  mounted() {
    this.firebaseUserIconImage =
      this.$fireModule.auth().currentUser?.photoURL || '';
    // TODO:本当はsideBarItemsはdataではなくcomputedを使用したいが、computedでstoreにアクセスすると以下エラーとなるためmountedを使用
    // The client-side rendered virtual DOM tree is not matching server-rendered content.
    this.sideBarItems = this.decideSidebarItems();
  },
  methods: {
    decideSidebarItems(): SidebarItem[] {
      return this.isLogined
        ? this.logginedSidebarItems
        : this.logoutSideBarItems;
    },
    routeToHome(): void {
      this.$router.push(this.homePath);
    },
    onClickedNavigationBar(): void {
      this.isDrawerMini = !this.isDrawerMini;
    },
  },
});
</script>

<style lang="sass" scoped>
.app-toobar-title
  cursor: pointer
</style>
