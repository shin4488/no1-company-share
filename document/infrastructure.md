# let's encryptによるSSL化（さくらVPS ubuntu + nginx + let's encrypt）

```
$ cat /etc/os-release
NAME="Ubuntu"
VERSION="20.04.1 LTS (Focal Fossa)"
PRETTY_NAME="Ubuntu 20.04.1 LTS"
VERSION_ID="20.04"

$ certbot --version
certbot 0.40.0

$ nginx -v
nginx version: nginx/1.18.0 (Ubuntu)
```

## 手順
* ドメイン取得
* ドメインとネームサーバの紐づけ
    * ドメインプロバイダー側でのネームサーバ指定
    * さくらVPS側でのネームサーバ指定
* nginxインストール
* certbotインストール
* SSL/TLS証明書の取得

## SSL/TLS証明書の取得

```
$ sudo certbot --nginx -d f1c.jp.net
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator nginx, Installer nginx
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for f1c.jp.net
Waiting for verification...
Cleaning up challenges
Deploying Certificate to VirtualHost /etc/nginx/sites-enabled/no1CompanyShare.conf

Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you're confident your site works on HTTPS. You can undo this
change by editing your web server's configuration.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2
Redirecting all traffic on port 80 to ssl in /etc/nginx/sites-enabled/no1CompanyShare.conf

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations! You have successfully enabled https://f1c.jp.net

You should test your configuration at:
https://www.ssllabs.com/ssltest/analyze.html?d=f1c.jp.net
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

IMPORTANT NOTES:
 - Congratulations! Your certificate and chain have been saved at:
   /etc/letsencrypt/live/f1c.jp.net/fullchain.pem
   Your key file has been saved at:
   /etc/letsencrypt/live/f1c.jp.net/privkey.pem
   Your cert will expire on 2022-08-18. To obtain a new or tweaked
   version of this certificate in the future, simply run certbot again
   with the "certonly" option. To non-interactively renew *all* of
   your certificates, run "certbot renew"
 - If you like Certbot, please consider supporting our work by:

   Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
   Donating to EFF:                    https://eff.org/donate-le
```

/etc/nginx/sites-enabled/no1CompanyShare.conf
`# managed by Certbot` と記載されている部分が自動追加される

```
$ cat no1CompanyShare.conf
```

```conf
server {
    server_name f1c.jp.net;

    location / {
        root /home/www/no1CompanyShare;
        index index.html;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/f1c.jp.net/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/f1c.jp.net/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

server {
    if ($host = f1c.jp.net) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    server_name f1c.jp.net;
    return 404; # managed by Certbot


}
```

3ヶ月ごとのSSL証明書更新を自動で行うように設定
（登録されているドメインすべてに対して設定する）

```
$ sudo certbot renew --dry-run
Saving debug log to /var/log/letsencrypt/letsencrypt.log

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Processing /etc/letsencrypt/renewal/baseballgames.jp.net.conf
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Cert not due for renewal, but simulating renewal for dry run
Plugins selected: Authenticator nginx, Installer nginx
Renewing an existing certificate
Performing the following challenges:
http-01 challenge for baseballgames.jp.net
http-01 challenge for tk2-231-25125.vs.sakura.ne.jp
http-01 challenge for www.baseballgames.jp.net
Waiting for verification...
Cleaning up challenges

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
new certificate deployed with reload of nginx server; fullchain is
/etc/letsencrypt/live/baseballgames.jp.net/fullchain.pem
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Processing /etc/letsencrypt/renewal/f1c.jp.net.conf
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Cert not due for renewal, but simulating renewal for dry run
Plugins selected: Authenticator nginx, Installer nginx
Renewing an existing certificate
Performing the following challenges:
http-01 challenge for f1c.jp.net
Waiting for verification...
Cleaning up challenges

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
new certificate deployed with reload of nginx server; fullchain is
/etc/letsencrypt/live/f1c.jp.net/fullchain.pem
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
** DRY RUN: simulating 'certbot renew' close to cert expiry
**          (The test certificates below have not been saved.)

Congratulations, all renewals succeeded. The following certs have been renewed:
  /etc/letsencrypt/live/baseballgames.jp.net/fullchain.pem (success)
  /etc/letsencrypt/live/f1c.jp.net/fullchain.pem (success)
** DRY RUN: simulating 'certbot renew' close to cert expiry
**          (The test certificates above have not been saved.)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

`(success)` と表示されていれば完了

# ubuntuへのPostgreSQLのインストール・インスタンス分け
## インストール
https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart-ja

```
$ sudo apt install postgresql postgresql-contrib
```

postgresユーザでデータベースの存在確認

```
$ sudo -i -u postgres
postgres=# \l
                              List of databases
   Name    |  Owner   | Encoding | Collate |  Ctype  |   Access privileges
-----------+----------+----------+---------+---------+-----------------------
 postgres  | postgres | UTF8     | C.UTF-8 | C.UTF-8 |
 template0 | postgres | UTF8     | C.UTF-8 | C.UTF-8 | =c/postgres          +
           |          |          |         |         | postgres=CTc/postgres
 template1 | postgres | UTF8     | C.UTF-8 | C.UTF-8 | =c/postgres          +
           |          |          |         |         | postgres=CTc/postgres
(3 rows)
```

クラスタの起動・停止
https://tkrd.hatenablog.com/entry/2017/04/23/015216

```
$ sudo systemctl start postgresql@12-クラスタ名
$ sudo systemctl stop postgresql@12-クラスタ名
```

https://www.postgresql.org/docs/12/app-psql.html

```
psql -h /tmp -p 20000 -d postgres
```

Sequelize上での指定

```ts
new Sequelize(
  'your_database_name',
  'your_user_name',
  'your_user_password',
  {
    host: '/tmp',
    port: 20000,
    dialect: 'postgres',
    logging: (log) => this.logger.log('info', log),
  },
);
```

## `yarn start` の永続化
https://qiita.com/isao_e_dev/items/36b99b0e186b2d656b50
https://www.sejuku.net/blog/81363
`-c` は「コマンド実行」の意味

```
$ sudo npm install -g forever
$ cd アプリのディレクトリ
$ forever start -c "yarn start" ./
```
