import { injectable } from 'inversify';
import { Op } from 'sequelize';
import { DivisionMasterDao } from './interface/dao';
import DivisionMaster from '@s/common/sequelize/models/divisionMaster';

@injectable()
export class DivisionMasterDaoImpl implements DivisionMasterDao {
  public async getDivisionsByColumn(
    columnName: string,
  ): Promise<DivisionMaster[]> {
    const divisions = await DivisionMaster.findAll({
      attributes: ['id', 'divisionDisplayedName'],
      where: {
        columnPhysicalName: {
          [Op.eq]: columnName,
        },
      },
    });

    return divisions;
  }
}
