# 開発ガイド

企業の情報を投稿・共有するNuxtアプリ。画面は `application/front/`、Express APIは `application/server/`、共通処理は `application/common/`。Firebase Functionsの実装は `functions/functions/src/`（外側の `functions/` と区別する）。

## 開発・検証

- ローカル構成は `docker-compose.yml`、起動・マウント条件は `application/Dockerfile`、アプリ設定は `application/nuxt.config.js` を確認する。`application/` で依存を用意した後、ルートの `docker compose up` が開発環境の入口。
- アプリはNode 24で実行する。Firebase Web SDKとAxiosは `front/plugins/` から直接提供し、SSR認証は `server/firebaseSsr.ts` でリクエストごとに検証する。`front/static/firebase-auth-sw.js` のFirebase SDK版はWeb SDK更新時に合わせる。
- アプリ変更は `application/` の `yarn lint`・`yarn test`・`yarn build` で必要な範囲を確認する。正確なscriptsと依存は `application/package.json` に従う。全体に書き込む `lintfix` は無関係な差分を作らないよう扱う。
- FunctionsはNode 22で、`functions/functions/` の `npm ci`・`npm run lint`・`npm test`（ビルドを含む）を使う。依存はpackage-lock.jsonに統一する。外側の `functions/` のFirebase CLIは引き続きYarnで管理する。ローカル実行は同ディレクトリの `package.json` と外側の `functions/firebase.json` に従い、エミュレータと実サービスの接続先を区別する。
- DB定義・初期化は `database/` を入口にする。`database/data/` は永続データなので、調査・検証のために削除しない。設定・サービスアカウント鍵・`.env` の値をコミット・ログ・文書へ転記しない。
- Firebaseへのdeploy、実データの保存・更新、DB初期化は外部反映やデータ変更を伴う。単なるビルド確認には含めず、依頼範囲と対象を確認して行う。既定ブランチは `develop`。PRの基点はリモートの設定も確認する。

## 作業の進め方

- 関連箇所・資料・skillsに絞って読み、根拠が足りなければ調査範囲を広げる。
- 判断に必要な不明点は既存資料で確認し、解消できなければ依存する作業の前に質問する。合意済み事項は再確認しない。
- 文書の言語を保ち、日本語は日本人に、英語は英語圏の読者に自然に伝わる表現にする。
- 該当する必須検証を行い、問題を修正する。差分・依存・設定・実行条件が同じなら結果を再利用し、結果と未確認事項を簡潔に報告する。
- 継続する規約と参照先だけを残し、進捗・設定値・他の資料やskillsの手順は複製しない。
