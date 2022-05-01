export interface CompanyListGetResponse {
  number: string;
  name: string;
  isRegistered: boolean;
}

export interface CompanyGetResponse {
  companies: CompanyListGetResponse[];
}
