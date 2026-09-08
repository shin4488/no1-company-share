# 開発ガイド

企業の情報を投稿・共有するNuxtアプリ。画面は `application/front/`、Express APIは `application/server/`、共通処理は `application/common/`。Firebase Functionsの実装は `functions/functions/src/`（外側の `functions/` と区別する）。

## 開発・検証

- ローカル構成は `docker-compose.yml`、起動・マウント条件は `application/Dockerfile`、アプリ設定は `application/nuxt.config.js` を確認する。`application/` で依存を用意した後、ルートの `docker compose up` が開発環境の入口。
- アプリはNode 24で実行する。Firebase Web SDKとAxiosは `front/plugins/` から直接提供し、SSR認証は `server/firebaseSsr.ts` でリクエストごとに検証する。`front/static/firebase-auth-sw.js` のFirebase SDK版はWeb SDK更新時に合わせる。
- アプリ変更は `application/` の `yarn lint`・`yarn test`・`yarn build` で必要な範囲を確認する。正確なscriptsと依存は `application/package.json` に従う。全体に書き込む `lintfix` は無関係な差分を作らないよう扱う。
- FunctionsはNode 22で、`functions/functions/` の `npm ci`・`npm run lint`・`npm test`（ビルドを含む）を使う。依存はpackage-lock.jsonに統一する。外側の `functions/` のFirebase CLIは引き続きYarnで管理する。ローカル実行は同ディレクトリの `package.json` と外側の `functions/firebase.json` に従い、エミュレータと実サービスの接続先を区別する。
- DB定義・初期化は `database/` を入口にする。`database/data/` は永続データなので、調査・検証のために削除しない。設定・サービスアカウント鍵・`.env` の値をコミット・ログ・文書へ転記しない。
- Firebaseへのdeploy、実データの保存・更新、DB初期化は外部反映やデータ変更を伴う。単なるビルド確認には含めず、依頼範囲と対象を確認して行う。既定ブランチは `develop`。PRの基点はリモートの設定も確認する。

## 調査と指示の保守

- `AGENTS.md` は `CLAUDE.md` への相対リンク。本文は一度読み、実体を編集する。
- `rg` は対象ディレクトリから名前・見出し・シンボルを探す。通常は `-g` で依存・成果物・ログ・ロックファイル・生成コードを除外し、依存・生成・型・障害の調査では直接読む。見つからなければ範囲・除外を見直す。
- 必須検証を行い、要点・失敗箇所を報告する。同じ差分・依存・設定・実行条件の結果は再利用する。
- ここは恒久規約・必須条件・主要コマンド・参照先に限る。進捗はチャット・既存Issue/PR、機能・構成・依存・設定等の現在値は元の定義へ。規約・条件・参照先の変更や継続して必要な判断基準の追加時に更新する。
- スキルは説明から選び、該当 `SKILL.md` に従う。一覧・手順は転記せず、このガイドの必須適用条件は守る。
