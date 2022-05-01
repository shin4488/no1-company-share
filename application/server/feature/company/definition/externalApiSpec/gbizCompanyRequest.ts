export interface GbizCompanyRequest {
  name: string;
  /**
   * JIS X 0401都道府県コード
   */
  // https://info.gbiz.go.jp/hojin/swagger-ui.html#!/gBizINFO_REST_API/searchInfoUsingGET
  prefecture: string;
  page: number;
  limit: number;
}
