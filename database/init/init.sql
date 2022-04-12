CREATE DATABASE companyshare;
\c companyshare;

-- ユーザ：ユーザID
CREATE TABLE public.user_master (
  -- firebaseのauthユーザid
  id CHAR(28) PRIMARY KEY
);
-- 会社マスタ：法人番号、会社名、ホームページURL
CREATE TABLE public.company_master (
  -- 予約語と被らないようにするために、companyをプレフィックスとしてつけている
  company_number CHAR(13) PRIMARY KEY,
  -- とりあえず100文字あれば入るだろうという想定
  company_name VARCHAR(100),
  -- Edgeが2000文字までの対応のため、最大2100文字としている
  homepage_url VARCHAR(2100)
);
-- 区分値マスタ：区分ID、カラム名、区分名、区分値
CREATE TABLE public.division_master (
  id SERIAL PRIMARY KEY,
  column_physical_name VARCHAR(20),
  division_value VARCHAR(20),
  division_display_name VARCHAR(20)
);

-- 投稿：投稿ID、法人番号、ユーザID、削除済み、報告済み、報告内容、備考
CREATE TABLE public.post (
  id CHAR(10) PRIMARY KEY,
  company_number CHAR(13) REFERENCES public.company_master (company_number) ON DELETE RESTRICT,
  user_id CHAR(28) REFERENCES public.user_master (id) ON DELETE RESTRICT,
  is_deleted BOOLEAN,
  is_reported BOOLEAN,
  report_detail VARCHAR(300),
  remarks VARCHAR(500)
);
-- 投稿詳細：投稿詳細ID、投稿ID、一位内容、一位区分
CREATE TABLE public.post_detail (
  id INTEGER,
  post_id CHAR(10) REFERENCES public.post (id) ON DELETE RESTRICT,
  no1_content VARCHAR(100),
  no1_division INTEGER REFERENCES public.division_master (id) ON DELETE RESTRICT,
  PRIMARY KEY (id, post_id)
);
-- お気に入り：投稿ID、お気に入りユーザID
CREATE TABLE public.bookmark (
  post_id CHAR(10) REFERENCES public.post (id) ON DELETE RESTRICT,
  user_id CHAR(28) REFERENCES public.user_master (id) ON DELETE RESTRICT,
  PRIMARY KEY (post_id, user_id)
);

-- 事前データ
INSERT INTO public.user_master (id) VALUES (
  'cDYrCmleUFhpDok0klZxvCpZVJt1'
);
