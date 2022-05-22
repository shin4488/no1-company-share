export interface SharedPostDetailPostParameter {
  key: string | null;
  no1Content: string;
  no1Division: string;
}

export interface SharedPostPostParameterItem {
  key: string | null;
  companyNumber: string;
  companyName: string;
  companyHomepageUrl: string;
  remarks: string;
  postDetails: SharedPostDetailPostParameter[];
}

export interface SharedPostPostParameter {
  userId: string;
  posts: SharedPostPostParameterItem[];
}
