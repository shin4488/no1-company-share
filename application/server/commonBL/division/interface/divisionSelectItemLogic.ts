import { SelectItem } from '@s/common/selectItem/data';

export interface DivisionSelectItemLogic {
  getDivisionSelectItemsByColumn(
    columnName: string,
    shouldIncludeEmptyItem?: boolean,
  ): Promise<SelectItem[]>;
}
