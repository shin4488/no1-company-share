export interface GbizCompanyResponseItem {
  corporate_number: string;
  name: string;
}

export interface GbizCompanyResponse {
  'hojin-infos'?: GbizCompanyResponseItem[];
}
