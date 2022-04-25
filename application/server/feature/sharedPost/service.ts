import { injectable } from 'inversify';
import { SharedPostGetReponse } from './definition/sharedPostGetReponse';
import { SharedPostService } from './interface/sharedPostService';

@injectable()
export class SharedPostServiceImpl implements SharedPostService {
  public async getSharedPosts(): Promise<SharedPostGetReponse> {
    const response: SharedPostGetReponse = await {};
    return response;
  }
}
