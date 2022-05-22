FROM ubuntu:20.04

# コンテナ間通信時は、コンテナ内部で使用されるポートを指定
# postgreSQLはデフォルトで5432ポートを使用
ENV POSTGRES_DATABASE=company_share
ENV POSTGRES_USER_NAME=company_share_admin
ENV POSTGRES_PASSWORD=admin
ENV POSTGRES_HOST_NAME=database
ENV POSTGRES_PORT=5432
# nuxtのサーバサイドプログラムもホットリロードを可能とする
ENV CHOKIDAR_USEPOLLING true
# firebase認証用
ENV FIREBASE_CONFIG ./server/common/middleware/secret/no1-company-share-firebase-adminsdk-secret.json
ENV GOOGLE_CLOUD_PROJECT no1-company-share
ENV NUXT_PORT 3100
ENV TZ Asia/Tokyo

RUN apt update
RUN apt install sudo -y
RUN apt install curl -y
# nodeは最新のLTSをインストール（npmも一緒にインストールされる）
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
RUN apt install -y nodejs
RUN npm install -g yarn

WORKDIR /home/app/companyshare

# ホスト側でyarn installしたものをマウントするため、yarn installはコンテナ側では行わない
CMD ["yarn", "dev"]
