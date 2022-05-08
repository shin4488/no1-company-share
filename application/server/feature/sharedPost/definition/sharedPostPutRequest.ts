export interface SharedPostDetailPutRequest {
  no1Content?: string | null;
  no1Division?: string | null;
}

export interface SharedPostPutRequestItem {
  id?: string | null;
  companyNumber?: string | null;
  companyName?: string | null;
  companyHomepageUrl?: string | null;
  remarks?: string | null;
  postDetails?: SharedPostDetailPutRequest[] | null;
}

export interface SharedPostPutRequest {
  posts?: SharedPostPutRequestItem[] | null;
}

export interface SharedPostPutRequestParameter {
  sharedPostId?: string;
}
