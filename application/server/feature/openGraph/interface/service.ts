import { OpenGraphGetParameter } from '../definition/openGraphGetParameter';
import { OpenGraphGetResponse } from '../definition/openGraphGetResponse';

export interface OpenGraphService {
  getOpenGraph(parameter: OpenGraphGetParameter): Promise<OpenGraphGetResponse>;
}
