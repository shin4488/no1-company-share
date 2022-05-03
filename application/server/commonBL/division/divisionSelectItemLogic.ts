import { inject, injectable } from 'inversify';
import { DivisionSelectItemLogic } from './interface/divisionSelectItemLogic';
import { types } from '@s/common/dependencyInjection/types';
import { SelectItem } from '@s/common/selectItem/data';
import { DivisionMasterDao } from '@s/commonBL/dao/division/interface/dao';
import { StringUtil } from '@c/util/stringUtil';

@injectable()
export class DivisionSelectItemLogicImpl implements DivisionSelectItemLogic {
  private divisionDao: DivisionMasterDao;

  constructor(@inject(types.DivisionMasterDao) divisionDao: DivisionMasterDao) {
    this.divisionDao = divisionDao;
  }

  async getDivisionSelectItemsByColumn(
    columnName: string,
    shouldIncludeEmptyItem: boolean = false,
  ): Promise<SelectItem[]> {
    const divisions = await this.divisionDao.getDivisionsByColumn(columnName);
    const selectItems = divisions.map<SelectItem>((x) => ({
      text: x.divisionDisplayedName,
      value: StringUtil.toString(x.id),
    }));

    if (shouldIncludeEmptyItem) {
      selectItems.unshift({
        text: '',
        value: '',
      });
    }

    return selectItems;
  }
}
