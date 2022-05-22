import { injectable } from 'inversify';
import { Transaction } from 'sequelize';
import { CompanyMasterDao } from './interface/dao';
import CompanyMaster, {
  CompanyMasterModelAttribute,
} from '@s/common/sequelize/models/companyMaster';

@injectable()
export class CompanyMasterDaoImpl implements CompanyMasterDao {
  public async upsertCompany(
    company: CompanyMasterModelAttribute,
    transaction: Transaction,
  ): Promise<CompanyMaster> {
    const [upsertedCompanyMaster] = await CompanyMaster.upsert(
      {
        companyNumber: company.companyNumber,
        companyJapaneseName: company.companyJapaneseName,
        companyEnglishName: company.companyEnglishName,
        homepageUrl: company.homepageUrl,
      },
      { transaction },
    );
    return upsertedCompanyMaster;
  }
}
