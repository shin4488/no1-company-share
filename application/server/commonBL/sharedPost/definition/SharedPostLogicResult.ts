export interface SharedPostLogicResultItemDetail {
  id: number;
  no1Content: string;
  no1Division: string;
}

export interface SharedPostLogicResultItem {
  id: string;
  companyNumber: string;
  companyName: string;
  companyHomepageUrl: string;
  companyImageUrl: string;
  postingUserId: string;
  postingUserName: string;
  postingUserIcomImageUrl: string;
  isBookmarkedByLoginUser: boolean;
  numberOfBookmarks: number;
  remarks: string;
  updatedAt: string;
  postDetails: SharedPostLogicResultItemDetail[];
}
