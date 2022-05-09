import { Transaction } from 'sequelize';
import CompanyMaster, {
  CompanyMasterModelAttribute,
} from '@s/common/sequelize/models/companyMaster';

export interface CompanyMasterDao {
  getCompaniesByNumber(numbers: string[]): Promise<CompanyMaster[]>;

  upsertCompany(
    company: CompanyMasterModelAttribute,
    transaction: Transaction,
  ): Promise<CompanyMaster>;
}
