export interface SharedPostDetailParameter {
  key?: string | null;
  no1Content: string;
  no1Division: string;
}

export interface SharedPostSaveParameter {
  key?: string | null;
  companyNumber: string;
  companyName: string;
  companyHomepageUrl: string;
  postDetails: SharedPostDetailParameter[];
}
