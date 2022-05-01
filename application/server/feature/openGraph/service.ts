import { injectable, inject } from 'inversify';
import { OpenGraphGetParameter } from './definition/openGraphGetParameter';
import { OpenGraphService } from './interface/service';
import {
  OpenGraphGetResponse,
  OpenGraph,
} from './definition/openGraphGetResponse';
import { OpenGraphLogic } from '@s/commonBL/openGraph/interface/logic';
import { types } from '@s/common/dependencyInjection/types';
import { StringUtil } from '@c/util/stringUtil';
import { OpenGraphType } from '@s/commonBL/openGraph/definition/openGraphType';
import { OpenGraphGetResult } from '@s/commonBL/openGraph/definition/openGraphGetResult';

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
        const openGraphResult = await this.logic
          .getOpenGraph(pageUri, [OpenGraphType.IMAGE])
          // エラーの際は画像取得しない
          .catch((): OpenGraphGetResult => ({ image: '' }));
        return {
          pageUri,
          imageUri: openGraphResult.image,
        };
      }),
    );

    // エラーの際は画像取得していないため、画像空文字は除いている
    const filteredResultUris = resultUris.filter((result) =>
      StringUtil.isNotEmpty(result.imageUri),
    );
    return {
      openGraphList: filteredResultUris,
    };
  }
}
