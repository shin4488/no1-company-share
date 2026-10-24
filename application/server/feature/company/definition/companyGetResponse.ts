export interface CompanyListGetResponse {
  number: string;
  name: string;
  /**
   * ログイン中のユーザーが、この企業の投稿（通報・削除されていないもの）をすでに持っている
   */
  isPostedByLoginUser: boolean;
}

export interface CompanyGetResponse {
  companies: CompanyListGetResponse[];
}
