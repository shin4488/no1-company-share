import { injectable } from 'inversify';
import { Op, Transaction } from 'sequelize';
import { CompanyMasterDao } from './interface/dao';
import CompanyMaster, {
  CompanyMasterModelAttribute,
} from '@s/common/sequelize/models/companyMaster';

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

  public async upsertCompany(
    company: CompanyMasterModelAttribute,
    transaction: Transaction,
  ): Promise<void> {
    await CompanyMaster.upsert(
      {
        companyNumber: company.companyNumber,
        companyName: company.companyName,
        homepageUrl: company.homepageUrl,
      },
      { transaction },
    );
  }
}
