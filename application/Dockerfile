FROM ubuntu:20.04

RUN apt update
RUN apt install sudo -y
RUN apt install curl -y
# nodeは最新のLTSをインストール（npmも一緒にインストールされる）
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
RUN apt install -y nodejs
RUN npm install -g yarn

WORKDIR /home/companyshare/app

# ホスト側でyarn installしたものをマウントするため、yarn installはコンテナ側では行わない
CMD ["yarn", "dev"]