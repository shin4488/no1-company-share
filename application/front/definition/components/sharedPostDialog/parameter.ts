export interface PostDialogDetailParameter {
  postDetailId: number | null;
  no1Content: string;
  no1Division: string;
}

export interface SharedPostDialogParameter {
  postId: string;
  companyNumber: string;
  companyName: string;
  companyHomepageUrl: string;
  companyImageUrl: string;
  remarks: string;
  updatedAt: string;
  postDetails: PostDialogDetailParameter[];
}
