export interface CompanyResponse {
  number: string | null;
  name: string | null;
  isPostedByLoginUser: boolean | null;
}

export interface CompanyGetResponse {
  companies: CompanyResponse[];
}
