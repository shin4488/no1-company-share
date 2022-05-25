\c company_share;

ALTER TABLE public.company_master
-- https://kyogom.com/tech/design/maxlength/
ADD COLUMN address VARCHAR(150),
ADD COLUMN latitude numeric(9, 7),
ADD COLUMN longitude numeric(10, 7);
