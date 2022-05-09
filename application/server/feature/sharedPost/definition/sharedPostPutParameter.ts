export interface SharedPutDetailPutParameter {
  no1Content: string;
  no1Division: string;
}

export interface SharedPostPutParameterItem {
  id: string;
  companyNumber: string;
  companyName: string;
  companyHomepageUrl: string;
  remarks: string;
  postDetails: SharedPutDetailPutParameter[];
}

export interface SharedPostPutParameter {
  userId: string;
  posts: SharedPostPutParameterItem[];
}
