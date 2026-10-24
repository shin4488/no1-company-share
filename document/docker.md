# Docker環境で起きた問題と対処

## PostgreSQL

データベースの初期化で次のエラーになる場合は、`database/.env` に `POSTGRES_INITDB_ARGS=--encoding=UTF-8 --locale=C` を設定して、エンコーディングとロケールを指定する。

```
initdb: error: invalid locale settings; check LANG and LC_* environment variables
```

https://stackoverflow.com/questions/41956994/initdb-bin-invalid-locale-settings-check-lang-and-lc-environment-variables

https://www.ikkitang1211.site/entry/docker_postgres_initdb_args

## node.js

`CMD ["yarn", "dev"]` を実行するディレクトリに package.json がないと、次のエラーになる。`application/Dockerfile` では `WORKDIR` をアプリのマウント先にしている。

```
error Couldn't find a package.json file in "/"
```

https://qiita.com/yakamazu/items/9d8bcba02f48a2ae022e#cmd

## yarn install遅い問題
https://tkkm.tokyo/post-495/

## 403
nginx の `alias` でディレクトリを指定するときは、末尾に `/` が必要（`alias /var/www/html;` ではなく `alias /var/www/html/;`）。

https://qiita.com/oogaki_newmedia/items/749c855ad985c8258e66

## nuxt起動（502になってしまう）
nginx コンテナから Nuxt の開発サーバーへ接続できるように、`application/nuxt.config.ts` の `devServer.host` を `'0.0.0.0'` にしている。nginx 側の転送先は `web/nginx.conf` の `upstream nodeapp` に書いている。

https://qiita.com/eijenson/items/7ed5cf6ea8716567d02a

## Nginx（静的コンテンツへのルーティング）
Nuxt が起動しているサーバーへ転送する server ディレクティブで、`listen` に `default_server` を付け、`server_name 任意の名前.localhost;` を書く。ブラウザからは `任意の名前.localhost` にアクセスする。

https://webkaru.net/linux/nginx-default-server/#:~:text=%E4%BE%8B%E7%A4%BA%E3%81%97%E3%81%BE%E3%81%99%E3%80%82-,%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%81%AE%E3%83%90%E3%83%BC%E3%83%81%E3%83%A3%E3%83%AB%E3%83%9B%E3%82%B9%E3%83%88%E3%81%AE%E8%A8%AD%E5%AE%9A,%E3%83%9B%E3%82%B9%E3%83%88%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%A7%E3%81%8D%E3%81%BE%E3%81%99%E3%80%82

```
http {
    server {
        listen 80 default_server;
        server_name f1c.localhost;

        location / {
            proxy_pass http://nodeapp;
        }
    }
}
```
