export interface OpenGraphLogic {
  getOpenGraphImageUri(pageUri: string): Promise<string>;
}
