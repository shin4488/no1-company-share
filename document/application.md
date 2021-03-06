# 環境
```
yarn -v
1.22.15
```

# Vue.js
## nuxt.jsとtypescriptでvuexのデータを扱う
https://zenn.dev/syuri/articles/ff82f5b13ffa73
nuxt.config.js（storeをtypescriptで$accessインテリセンス可能とするため）

```js
export default {
  buildModules: [
    'nuxt-typed-vuex'
  ],
  build: {
    transpile: [/typed-vuex/]
  }
}
```

~/store/index.ts

```ts
import {
  getAccessorType,
  getterTree,
  mutationTree,
  actionTree,
} from 'typed-vuex';
import * as firebaseUser from './firebaseUser';

export const state = () => ({});
export const getters = getterTree(state, {});
export const mutations = mutationTree(state, {});
export const actions = actionTree({ state, getters, mutations }, {});
export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: {
    firebaseUser,
  },
});
```

~/store/firebaseUser.ts

```ts
import { getterTree, mutationTree, actionTree } from 'typed-vuex';

export const state = () => ({
  userId: null as string | null,
});
export type RootState = ReturnType<typeof state>;

export const getters = getterTree(state, {
  userId(state): string | null {
    return state.userId;
  },
});

export const mutations = mutationTree(state, {
  setUserId(state, userId: string | null) {
    state.userId = userId;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    setLoginUserId({ commit }, userId: string) {
      commit('setUserId', userId);
    },
  },
);
```

~/types/index.d.ts

```ts
import { accessorType } from '@f/store';

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType;
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType;
  }
}
```

ストアへのアクセス

```ts
this.$accessor.firebaseUser.setLoginUserId('aaaaaa');
console.log(this.$accessor.firebaseUser.userId);
```

## nuxt.jsでfirebaseを使用する
https://zenn.dev/kojinishimura/articles/87aae239571fb4#5.%E9%80%A3%E6%90%BA%E3%81%AE%E7%A2%BA%E8%AA%8D%E3%81%A8compositionapi%E3%81%A7%E3%81%AEfirebase%E3%81%AE%E5%91%BC%E3%81%B3%E5%87%BA%E3%81%97%E6%96%B9

nuxt.config.js

```js
export default {
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/firebase',
  ],
  firebase: {
    config: {
      apiKey: '<apiKey>',
      authDomain: '<authDomain>',
      projectId: '<projectId>',
      storageBucket: '<storageBucket>',
      messagingSenderId: '<messagingSenderId>',
      appId: '<appId>',
      measurementId: '<measurementId>',
    },
    services: {
      auth: true,
      analytics: true,
    },
    injectModule: true,
  },
}
```

tsconfig.json

```json
{
  "compilerOptions": {
    "types": [
      "@nuxtjs/firebase",
    ]
  }
}
```

```ts
const provider = new this.$fireModule.auth.GoogleAuthProvider();
const credential = await this.$fire.auth.signInWithPopup(provider);
const userId = credential.user?.uid;
this.$fire.auth.signOut();
```

## 以下のエラー

```
vue.runtime.esm.js?2b0e:619 [Vue warn]: The client-side rendered virtual DOM tree is not matching server-rendered content. This is likely caused by incorrect HTML markup, for example nesting block-level elements inside <p>, or missing <tbody>. Bailing hydration and performing full client-side render.
```

https://github.com/nuxt-community/firebase-module/issues/502

computed内の処理でstoreを参照すると発生？
↓ひとまずの代替策

```ts
computed: {
  firebaseUserId(): string | null {
    return this.$accessor.firebaseAuthorization.userId;
  },
},
watch: {
  // ログイン状態が変わればサイドバー表示内容も変更
  firebaseUserId(updatedUserId) {
    this.sideBarItems = this.setSidebarItems(updatedUserId);
  },
},
mounted() {
  // TODO:本当はsideBarItemsはdataではなくcomputedを使用したいが、computedでstoreにアクセスすると以下エラーとなるためmountedを使用
  // The client-side rendered virtual DOM tree is not matching server-rendered content.
  const firebaseUserId = this.$accessor.firebaseAuthorization.userIdComputed;
  this.sideBarItems = this.setSidebarItems(firebaseUserId);
},
```

## expressでミドルウェアなどからAPI側にデータを受け継ぐ方法（リクエストスコープでデータを複数処理に受け継ぐ方法）
用途：ミドルウェアで認証したユーザ情報をAPI側で使用するなど
https://stackoverflow.com/questions/55362741/overwrite-any-in-typescript-when-merging-interfaces
`response.locals` を使用する
server/types/index.d.tsにいかを記述

```ts
import 'express';

declare module 'express' {
  export interface Response {
    locals: {
      // 追加したいデータをここで記述する
      userId?: string;
    };
  }
}
```

ミドルウェアの処理（データをセットする側）

```ts
export const authorizationUser = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) => {
  response.locals.userId = 'hogehoge';
};
```

APIの処理（セットされているデータを読み取る側）

```ts
export const apiController = (request: express.Request, response: express.Response) => {
  console.log(response.locals.userId); // hogehoge
};
```

## pluginを使用したaxiosの共通処理
用途例：リクエストヘッダにAuthorizeヘッダ（認証データ）をつけるなどを共通処理化する
https://b1san-blog.com/post/nuxtjs/nuxt-axios/


front/store/index.ts

```ts
import {
  getAccessorType,
  getterTree,
  mutationTree,
  actionTree,
} from 'typed-vuex';
import * as firebaseAuthorization from './firebaseAuthorization';

export const state = () => ({});
export const getters = getterTree(state, {});
export const mutations = mutationTree(state, {});
export const actions = actionTree({ state, getters, mutations }, {});
export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: {
    firebaseAuthorization,
  },
});
```

front/types/index.d.tsにいかを追加

```ts
import { accessorType } from '~/front/store';

declare module '@nuxt/types' {
  interface Context {
    $accessor: typeof accessorType;
  }
}
```

front/plugins/axios.ts
pluginからstoreにアクセスするには$accessorを引数のオブジェクトに追加

```ts
import { Context, Plugin } from '@nuxt/types';

const plugin: Plugin = ({ $axios, $accessor }: Context) => {
  // リクエスト送信の共通処理
  $axios.onRequest((config) => {
    // storeにはidTokenComputedというgetterが存在する
    config.headers.Authorization =
      $accessor.firebaseAuthorization.idTokenComputed;
    return config;
  });
  // レスポンスエラー時の共通処理
  $axios.onResponseError((error) => {
    console.log(error);
  });
};

export default plugin;
```

nuxt.confi.js

```js
export default {
  plugins: ['~/front/plugins/axios.ts'],
}
```

## スナックバーをthis指定で表示する
Typescriptファイルからでもスナックバー表示タイミングを制御できるようになる

~/front/store/snackBarError.ts

```ts
import { mutationTree, actionTree } from 'typed-vuex';

export const state = () => ({
  message: '' as string,
});
export type RootState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  open(state, message: string) {
    state.message = message;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    open({ commit }, message: string) {
      commit('open', message);
    },
  },
);
```

~/front/components/SnackBarError.vue

```html
<template>
  <v-snackbar v-model="isShown" top max-width="60%" color="error">
    {{ message }}

    <template #action="{ attrs }">
      <v-btn
        small
        plain
        shaped
        multi-line
        v-bind="attrs"
        @click="onClickedCloseButton"
      >
        <v-icon> mdi-close </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { SnackBarErrorData } from '@f/definition/components/snackBarError/snackBarErrorData';

export default Vue.extend({
  name: 'SnackBarError',
  data(): SnackBarErrorData {
    return {
      isShown: false,
      message: '',
    };
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackBarError/open') {
        this.message = state.snackBarError.message;
        this.isShown = true;
      }
    });
  },
  methods: {
    onClickedCloseButton(): void {
      this.isShown = false;
    },
  },
});
</script>
```

~/front/layouts/default.vue

```html
<template>
  <v-app>
    <SnackBarError></SnackBarError>
  </v-app>
</template>

<script lang="ts">
import SnackBarError from '@f/components/SnackBarError.vue';
export default Vue.extend({
  components: {
    SnackBarError,
  },
});
</script>
```

呼び出し方（vueインスタンス内やpluginなどnuxtのContextを取得できるところから）

```ts
const plugin: Plugin = ({ $axios, $accessor }: Context) => {
  $axios.onResponseError((error: AxiosError<AppResponse>) => {
    const response = error.response;
    if (response === undefined) {
      return;
    }

    const responseBody = response.data;
    const message = someProcessForMessage(responseBody);
    $accessor.snackBarError.open(message);
  });
};
```

## dialogの結果をawaitで待っている実装
https://qiita.com/minojiro/items/e7e3128c7c779ca09ec7
https://v2.vuejs.org/v2/api/?redirect=true#vm-on
コンポーネント内で$emitしたイベントは、同じコンポーネント内で$onでリッスン可能

## v-for内で同じ親を持つ要素のkey指定
https://qiita.com/ysKuga/items/fa2ba12b10bade86da36

うまくいかない

```html
<template v-for="(item, index) in items">
  <v-col :key="index">
    内容1
  </v-col>
  <v-col :key="index">
    内容2
  </v-col>
</template>
```

うまくいく

```html
<template v-for="(item, index) in items">
  <v-col :key="`first-col-${index}`">
    内容1
  </v-col>
  <v-col :key="`second-col-${index}`">
    内容2
  </v-col>
</template>
```

## Vuetifyのxs指定ができない
https://qiita.com/rubytomato@github/items/07fe07e64482f8f03ef3

```
プロパティ名の接尾辞にsmやmdなど、Viewport Breakpointsのコードが付くものがあります。ただしxsについてはデフォルト扱いなのか接尾辞に付きません。
```

## nuxtでのasyncData再実行（リロード）
https://stackoverflow.com/questions/53821555/how-to-refresh-the-data-obtained-by-async-data-in-nuxtjs

```ts
await this.$nuxt.refresh();
```

<!-- TODO:未解決のため、不要であれば消す -->
## class-transformerのdecoratorの使用
以下のエラーが出てしまう

```
Decorating class property failed. Please ensure that proposal-class-properties is enabled and runs after the decorators transform.
```

https://yukiyuriweb.com/2018/06/02/react-and-mobx-with-webpack4-and-babel7/

```
yarn add @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators
```

.babelrc（pluginsを追加）

```json
{
  "env": {
    "test": {
      "presets": [
        [
          "@babel/preset-env",
          {
            "targets": {
              "node": "current"
            }
          }
        ]
      ],
      "plugins": [
        [
          "@babel/plugin-proposal-decorators",
          {
            "legacy": true
          }
        ],
        [
          "@babel/plugin-proposal-class-properties",
          {
            "loose": true
          }
        ]
      ]
    }
  }
}
```

https://www.aizulab.com/blog/referenceerror-regeneratorruntime-is-not-defined/

```
regeneratorRuntime is not defined
```

```ts
export default {
  build: {
    extend(config) {
      config.resolve.alias['@f'] = path.resolve(__dirname, 'front');
      config.resolve.alias['@c'] = path.resolve(__dirname, 'common');
    },
    // storeをtypescriptで$accessインテリセンス可能とするため
    transpile: [/typed-vuex/],
    babel: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
          },
        ],
      ],
      plugins: [
        [
          '@babel/plugin-proposal-decorators',
          {
            legacy: true,
          },
        ],
        [
          '@babel/plugin-proposal-class-properties',
          {
            loose: false,
          },
        ],
      ],
    },
  },
}
```


# Typescript
## 絶対パスでimport

```
front
 ┣assets
 ┣components
 ┣commons
  ┗ajax
   ┗calloutHelper.ts
 ┣layouts
 ┣pages
  ┗index.vue
server
 ┣commons
  ┗greet.ts
 ┗index.ts
node_modules
nuxt.config.js
package.json
tsconfig.json
```

tsconfig.json

```json
{
  "compilerOptions": {
      "paths": {
      "~f/*": ["./front/*"],
      "@f/*": ["./front/*"],
      "~s/*": ["./server/*"],
      "@s/*": ["./server/*"]
    }
  }
}
```

 ┣commons
  ┗ajax
   ┗calloutHelper.ts

```ts
/**
 * Httpコールアウトの共通クラス
 */
export class CalloutHepler {
  sayHello(value: string) {
    console.log(`hello ${value}`);
    return `this is returned ${value}`;
  }
}
```

 ┣pages
  ┗index.vue

```vue
<script lang="ts">
import Vue from 'vue';
import { CalloutHepler } from '@f/commons/ajax/calloutHelper';

export default Vue.extend({
  name: 'IndexPage',
  data: () => {
    return {
      message: '',
    };
  },
  mounted() {
    const instance = new CalloutHepler();
    const result = instance.sayHello(this.message);
    console.log('result');
    console.log(result);
  },
});
</script>
```

https://qiita.com/soutarrr7/items/1b9a46df604ed78ec747
nuxt.config.jsにいかを追加して、webpackにalias解決の設定を拡張（追加）する

```js
export default {
  build: {
    extend(config) {
      config.resolve.alias['@f'] = path.resolve(__dirname, 'front');
      config.resolve.alias['@s'] = path.resolve(__dirname, 'server');
    },
  },
};
```

# Node.js
## Typescriptで使用しない第一引数がある（第二引数以降は使用する）場合のeslintの警告抑制方法
https://falsandtru.github.io/guidelines/typescript/

```ts
app.get(
  '/api/test',
  (req: express.Request, res: express.Response) => {
    res.send({ result: 'test' });
  },
);
```

```
'req' is defined but never used. Allowed unused args must match /^_/u.
```

アンダースコアまたはアンダースコアで始まる変数名を使用する
（破棄変数を使用する）
引数としては定義しつつ、代入を破棄する

```ts
app.get(
  '/api/test',
  (_req: express.Request, res: express.Response) => {
    res.send({ result: 'test' });
  },
);
```

// serverMiddlewareに登録されたサーバ処理ではaliasを使用できないので、module-aliasというライブラリを使っている
// https://github.com/nuxt/nuxt.js/issues/4580
// https://github.com/nuxt/nuxt.js/issues/7017
import 'module-alias/register';
を一番はじめに記述

package.jsonにいかの記述を追加

```json
{
  "_moduleAliases": {
    "@s": "./server"
  }
}
```
https://stackoverflow.com/questions/58634070/typescript-path-alias-needs-module-alias-register-on-every-file

## serverMiddlewareのホットリロード（実際にはファイル置き換え）
https://www.ikkitang1211.site/entry/2020/10/11/213824

```.env
CHOKIDAR_USEPOLLING=true
```
