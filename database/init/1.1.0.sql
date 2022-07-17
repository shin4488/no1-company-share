\c company_share;

ALTER TABLE public.company_master
-- https://kyogom.com/tech/design/maxlength/
ADD COLUMN image_url VARCHAR(2100);
