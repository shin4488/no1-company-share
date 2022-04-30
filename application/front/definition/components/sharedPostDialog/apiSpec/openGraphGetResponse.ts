export interface OpenGraph {
  pageUri: string;
  imageUri: string;
}

export interface OpenGraphGetResponse {
  openGraphList: OpenGraph[];
}
