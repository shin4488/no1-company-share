--ユーザーの作成
-- CREATE USER devUser;
--DBの作成
CREATE DATABASE test;
--ユーザーにDBの権限をまとめて付与
-- GRANT ALL PRIVILEGES ON DATABASE test TO postgres;
--データベースを切り替え
\c test
--テーブルを作成
CREATE TABLE Book (
  id integer,
  name varchar(30)
);
--テーブルにデータを挿入
INSERT INTO Book VALUES (
    1,
    'The Very Hungry Caterpillar'
);
