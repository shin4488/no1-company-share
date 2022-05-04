export interface OpenGraph {
  pageUri: string | null;
  imageUri: string | null;
}

export interface OpenGraphGetResponse {
  openGraphList: OpenGraph[];
}
