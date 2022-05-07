CREATE DATABASE company_share;
\c company_share;
ALTER DATABASE company_share SET timezone TO 'Asia/Tokyo';

GRANT ALL PRIVILEGES ON DATABASE company_share TO company_share_admin;

-- ユーザ：ユーザID
CREATE TABLE public.user_master (
  -- firebaseのauthユーザid
  id VARCHAR(28) PRIMARY KEY,
  icon_image_url VARCHAR(2100),
  displayed_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
-- 会社マスタ：法人番号、会社名、ホームページURL
CREATE TABLE public.company_master (
  -- 予約語と被らないようにするために、companyをプレフィックスとしてつけている
  company_number VARCHAR(13) PRIMARY KEY,
  -- とりあえず100文字あれば入るだろうという想定
  company_name VARCHAR(100),
  -- Edgeが2000文字までの対応のため、最大2100文字としている
  homepage_url VARCHAR(2100),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
-- 区分値マスタ：区分ID、カラム名、区分名、区分値
CREATE TABLE public.division_master (
  id SERIAL PRIMARY KEY,
  column_physical_name VARCHAR(20),
  division_displayed_name VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 投稿：投稿ID、法人番号、ユーザID、削除済み、報告済み、報告内容、備考
CREATE TABLE public.shared_post (
  id VARCHAR(58) PRIMARY KEY,
  company_number VARCHAR(13) REFERENCES public.company_master (company_number) ON DELETE RESTRICT,
  user_id VARCHAR(28) REFERENCES public.user_master (id) ON DELETE RESTRICT,
  is_deleted BOOLEAN,
  is_reported BOOLEAN,
  report_detail VARCHAR(300),
  remarks VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
-- 投稿詳細：投稿詳細ID、投稿ID、一位内容、一位区分
CREATE TABLE public.shared_post_detail (
  id INTEGER,
  -- 投稿削除時に投稿詳細も削除
  shared_post_id VARCHAR(58) REFERENCES public.shared_post (id) ON DELETE CASCADE,
  no1_content VARCHAR(100),
  no1_division INTEGER REFERENCES public.division_master (id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (id, shared_post_id)
);
-- お気に入り：投稿ID、お気に入りユーザID
CREATE TABLE public.bookmark (
  -- 投稿削除時にお気に入りも削除
  shared_post_id VARCHAR(58) REFERENCES public.shared_post (id) ON DELETE CASCADE,
  user_id VARCHAR(28) REFERENCES public.user_master (id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (shared_post_id, user_id)
);

-- 本番時の事前データ
INSERT INTO public.division_master (
  column_physical_name,
  division_displayed_name
) VALUES (
  'NO1_DIVISION',
  '世界一'
), (
  'NO1_DIVISION',
  '日本一'
), (
  'NO1_DIVISION',
  '福井一'
);
