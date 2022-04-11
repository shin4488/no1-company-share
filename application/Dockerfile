FROM ubuntu:20.04

RUN apt update
RUN apt install sudo -y
RUN apt install curl -y
# nodeは最新のLTSをインストール（npmも一緒にインストールされる）
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
RUN apt install -y nodejs
RUN npm install -g yarn

# VOLUME . /home/companyshare/app
# VOLUME ./node_modules /home/companyshare/app/node_modules
# COPY . /home/companyshare/app
WORKDIR /home/companyshare/app
# RUN yarn install
# RUN chmod -R 755 /home/companyshare/app

CMD ["yarn", "dev"]