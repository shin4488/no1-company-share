import { injectable, inject } from 'inversify';
import { OpenGraphLogic } from './interface/logic';
import { OpenGraphGetParameter } from './definition/openGraphGetParameter';
import { OpenGraphService } from './interface/service';
import {
  OpenGraphGetResponse,
  OpenGraph,
} from './definition/openGraphGetResponse';
import { types } from '@s/common/dependencyInjection/types';
import { StringUtil } from '@c/util/stringUtil';

@injectable()
export class OpenGraphServiceImpl implements OpenGraphService {
  private logic: OpenGraphLogic;

  constructor(@inject(types.OpenGraphLogic) logic: OpenGraphLogic) {
    this.logic = logic;
  }

  public async getOpenGraph(
    parameter: OpenGraphGetParameter,
  ): Promise<OpenGraphGetResponse> {
    const pageUris = parameter.pageUris;

    const resultUris = await Promise.all(
      pageUris.map<Promise<OpenGraph>>(async (pageUri) => {
        const imageUri = await this.logic
          .getOpenGraphImageUri(pageUri)
          // エラーの際は画像取得しない
          .catch(() => '');
        return {
          pageUri,
          imageUri,
        };
      }),
    );

    const filteredResultUris = resultUris.filter((result) =>
      StringUtil.isNotEmpty(result.imageUri),
    );
    return {
      openGraphList: filteredResultUris,
    };
  }
}
