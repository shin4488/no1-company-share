import { SharedPostParameterDto } from '../definition/sharedPostParameterDto';
import SharedPost from '@s/common/sequelize/models/sharedPost';

export interface SharedPostDao {
  getSharedPostWithDetails(
    parameterDto: SharedPostParameterDto,
  ): Promise<SharedPost[]>;
}
