import { Transaction } from 'sequelize';
import { SharedPostIdCreationParameter } from '../definition/sharedPostIdCreationParameter';
import { SharedPostSaveParameter } from '../definition/sharedPostSaveParameter';
import { SharedPostSaveResult } from '../definition/sharedPostSaveResult';
import SharedPost from '@s/common/sequelize/models/sharedPost';
import CompanyMaster from '@s/common/sequelize/models/companyMaster';

export interface SharedPostSaveLogic {
  /**
   * 会社ホームページのOG画像のURL。外部サイトの応答を待つ間にDBの接続と投稿のロックを持ち続けないよう、トランザクションの前に呼ぶ
   */
  getCompanyImageUrl(companyHomepageUrl: string): Promise<string>;

  createModels(
    parameter: SharedPostSaveParameter,
    companyImageUrl: string,
    transaction: Transaction,
    createSharedPost: (company: CompanyMaster) => Promise<SharedPost>,
  ): Promise<SharedPostSaveResult>;

  createSharedPostId(parameter: SharedPostIdCreationParameter): string;
}
