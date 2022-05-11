import { injectable } from 'inversify';
import { SharedPostParameterDto } from './definition/sharedPostParameterDto';
import { SharedPostDao } from './interface/dao';
import SharedPost from '@s/common/sequelize/models/sharedPost';
import SharedPostDetail from '@s/common/sequelize/models/sharedPostDetail';
import CompanyMaster from '@s/common/sequelize/models/companyMaster';
import UserMaster from '@s/common/sequelize/models/userMaster';
import Bookmark from '@s/common/sequelize/models/bookmark';

@injectable()
export class SharedPostDaoImple implements SharedPostDao {
  public async getSharedPostWithDetails(
    parameterDto: SharedPostParameterDto,
  ): Promise<SharedPost[]> {
    // TODO:動的にWHERE句組み立て
    // const whereClause = {
    //   where: {

    //   }
    // };

    const resultDto = await SharedPost.findAll({
      attributes: ['id', 'companyNumber', 'userId', 'remarks', 'updatedAt'],
      include: [
        {
          model: SharedPostDetail,
          attributes: ['id', 'no1Content', 'no1Division'],
          required: true,
        },
        {
          model: Bookmark,
          attributes: ['sharedPostId', 'userId'],
        },
        {
          model: CompanyMaster,
          attributes: [
            'companyJapaneseName',
            'companyEnglishName',
            'homepageUrl',
          ],
        },
        {
          model: UserMaster,
          attributes: ['iconImageUrl', 'displayedName'],
        },
      ],
      order: [
        ['updatedAt', 'DESC'],
        ['SharedPostDetails', 'id', 'ASC'],
      ],
      limit: parameterDto.limit,
    });

    console.log(parameterDto);
    return resultDto;
  }
}
