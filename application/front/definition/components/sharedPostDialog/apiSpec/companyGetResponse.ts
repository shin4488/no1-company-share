export interface CompanyResponse {
  number: string | null;
  name: string | null;
  isRegistered: boolean | null;
}

export interface CompanyGetResponse {
  companies: CompanyResponse[];
}
