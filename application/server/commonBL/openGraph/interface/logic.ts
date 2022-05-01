import { OpenGraphGetResult } from '../definition/openGraphGetResult';
import { OpenGraphType } from '../definition/openGraphType';

export interface OpenGraphLogic {
  getOpenGraph(
    pageUri: string,
    ogTypes: OpenGraphType[],
  ): Promise<OpenGraphGetResult>;
}
