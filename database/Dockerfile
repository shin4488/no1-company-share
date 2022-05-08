FROM ubuntu/postgres:12-20.04_beta

RUN apt update
RUN apt install sudo
# 本当はクラスタを作成したい（本番機ではクラスタ分けする想定であるため）
# https://tkrd.hatenablog.com/entry/2017/04/23/015216
RUN sudo pg_createcluster --port=5432 12 companyshare
RUN sudo pg_ctlcluster 12 companyshare start

ENV TZ Asia/Tokyo
