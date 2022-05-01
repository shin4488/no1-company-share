import { injectable } from 'inversify';
import { Op } from 'sequelize';
import { CompanyMasterDao } from './interface/dao';
import CompanyMaster from '@s/common/sequelize/models/companyMaster';

@injectable()
export class CompanyMasterDaoImpl implements CompanyMasterDao {
  public async getCompaniesByNumber(
    numbers: string[],
  ): Promise<CompanyMaster[]> {
    const companies = await CompanyMaster.findAll({
      attributes: ['companyNumber'],
      where: {
        companyNumber: {
          [Op.in]: numbers,
        },
      },
    });

    return companies;
  }
}
