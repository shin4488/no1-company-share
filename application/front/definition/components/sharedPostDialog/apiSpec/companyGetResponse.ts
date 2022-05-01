export interface CompanyResponse {
  number: string;
  name: string;
  isRegistered: boolean;
}

export interface CompanyGetResponse {
  companies: CompanyResponse[];
}
