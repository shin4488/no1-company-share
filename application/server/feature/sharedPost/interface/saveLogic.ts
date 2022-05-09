import { Transaction } from 'sequelize/types';
import { SharedPostIdCreationParameter } from '../definition/sharedPostIdCreationParameter';
import { SharedPostSaveParameter } from '../definition/sharedPostSaveParameter';
import { SharedPostSaveResult } from '../definition/sharedPostSaveResult';
import SharedPost from '@s/common/sequelize/models/sharedPost';
import CompanyMaster from '@s/common/sequelize/models/companyMaster';

export interface SharedPostSaveLogic {
  createModels(
    parameter: SharedPostSaveParameter,
    transaction: Transaction,
    createSharedPost: (company: CompanyMaster) => Promise<SharedPost>,
  ): Promise<SharedPostSaveResult>;

  createSharedPostId(parameter: SharedPostIdCreationParameter): string;
}
