export interface SharedPostDetailPostRequest {
  no1Content: string;
  no1Division: string;
}

export interface SharedPostPostRequestItem {
  companyNumber: string;
  companyName: string;
  companyHomepageUrl: string;
  remarks: string;
  postDetails: SharedPostDetailPostRequest[];
}

export interface SharedPostPostRequest {
  posts: SharedPostPostRequestItem[];
}
