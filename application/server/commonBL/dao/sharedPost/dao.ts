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
    const resultDto = await SharedPost.findAll({
      attributes: ['id', 'companyNumber', 'userId', 'remarks', 'updatedAt'],
      include: [
        {
          model: SharedPostDetail,
          attributes: ['id', 'no1Content', 'no1Division'],
          required: true,
          // as: 'sharedPostDetail',
        },
        {
          model: Bookmark,
          as: 'bookmark',
        },
        {
          model: CompanyMaster,
          attributes: [
            'companyJapaneseName',
            'companyEnglishName',
            'homepageUrl',
          ],
          as: 'companyMaster',
        },
        {
          model: UserMaster,
          attributes: ['iconImageUrl', 'displayedName'],
          as: 'userMaster',
        },
      ],
      // TODO:raw指定すると子レコードが配列で取得できない
      // raw: true,
      // nest: true,
    });

    console.log(parameterDto);
    return resultDto;
  }
}
