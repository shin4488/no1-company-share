export interface SharedPostDetailPostRequest {
  key?: string | null;
  no1Content?: string | null;
  no1Division?: string | null;
}

export interface SharedPostPostRequestItem {
  key?: string | null;
  companyNumber?: string | null;
  companyName?: string | null;
  companyHomepageUrl?: string | null;
  remarks?: string | null;
  postDetails?: SharedPostDetailPostRequest[] | null;
}

export interface SharedPostPostRequest {
  posts?: SharedPostPostRequestItem[] | null;
}
