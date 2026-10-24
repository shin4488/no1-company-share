# PostgreSQL
## 主キー複数カラム
CREATE TABLE時に `PRIMARY KEY(column1, column2)` 指定とする
https://www.dbonline.jp/postgresql/table/index6.html

## serial型の外部キー参照
参照する側の列はINTEGER型とする

```sql
no1_division INTEGER REFERENCES public.division_master (id) ON DELETE RESTRICT,
```

https://qiita.com/kure/items/f34a5ee98e0ef4fee132
