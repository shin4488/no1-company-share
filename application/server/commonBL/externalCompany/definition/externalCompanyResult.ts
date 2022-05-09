export interface ExternalCompanyResultItem {
  companyNumber: string;
  japaneseName: string;
  englishName: string;
}

export interface ExternalCompanyResult {
  companies: ExternalCompanyResultItem[];
}
