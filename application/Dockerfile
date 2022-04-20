FROM ubuntu:20.04

# コンテナ間通信時は、コンテナ内部で使用されるポートを指定
# postgreSQLはデフォルトで5432ポートを使用
ENV DB_CONNECTION_URI postgres://company_share_admin:admin@database:5432/company_share
# nuxtのサーバサイドプログラムもホットリロードを可能とする
ENV CHOKIDAR_USEPOLLING true

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
