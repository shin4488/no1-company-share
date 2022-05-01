export interface PostDialogDetailResult {
  postDetailId: number;
  no1Content: string;
  no1Division: string;
}

export interface SharedPostDialogResult {
  postId: string;
  companyNumber: string;
  companyName: string;
  companyHomepageUrl: string;
  companyImageUrl: string;
  remarks: string;
  updatedAt: string;
  postDetails: PostDialogDetailResult[];
}
