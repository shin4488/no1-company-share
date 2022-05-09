export interface GbizCompanyResponseItem {
  corporate_number: string;
  name: string;
  name_en?: string;
}

export interface GbizCompanyResponse {
  'hojin-infos'?: GbizCompanyResponseItem[];
}
