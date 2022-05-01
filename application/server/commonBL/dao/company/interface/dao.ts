import CompanyMaster from '@s/common/sequelize/models/companyMaster';

export interface CompanyMasterDao {
  getCompaniesByNumber(numbers: string[]): Promise<CompanyMaster[]>;
}
