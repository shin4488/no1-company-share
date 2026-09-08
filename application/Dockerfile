FROM node:24.20.0-bookworm@sha256:be23f54a88d34e8824c741b19b91064094f92c1c97b194144bfc8b50d67258e2

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


WORKDIR /home/app/companyshare

# ホスト側でyarn installしたものをマウントするため、yarn installはコンテナ側では行わない
CMD ["yarn", "dev"]
