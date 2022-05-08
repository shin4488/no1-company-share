export interface SharedPostDetailPutRequest {
  no1Content: string;
  no1Division: string;
}

export interface SharedPostPutRequestItem {
  id: string;
  companyNumber: string;
  companyName: string;
  companyHomepageUrl: string;
  remarks: string;
  postDetails: SharedPostDetailPutRequest[];
}

export interface SharedPostPutRequest {
  posts: SharedPostPutRequestItem[];
}
