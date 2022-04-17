# 環境
```
yarn -v
1.22.15
```

# Vue.js


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
