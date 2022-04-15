# PostgreSQL
## 主キー複数カラム
CREATE TABEL時に `PRIMARY KEY(column1, columns2)` 指定とする
https://www.dbonline.jp/postgresql/table/index6.html

## searial型の外部キー参照
INTEGER型とする
  no1_division INTEGER REFERENCES public.division_master (id) ON DELETE RESTRICT,
https://qiita.com/kure/items/f34a5ee98e0ef4fee132
