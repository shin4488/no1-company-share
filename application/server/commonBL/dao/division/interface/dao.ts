import DivisionMaster from '@s/common/sequelize/models/divisionMaster';

export interface DivisionMasterDao {
  getDivisionsByColumn(columnName: string): Promise<DivisionMaster[]>;
}
