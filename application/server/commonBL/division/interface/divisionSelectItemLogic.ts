import { SelectItem } from '@s/common/selectItem/data';

export interface DivisionSelectItemLogic {
  getDivisionSelectItemsByColumn(columnName: string): Promise<SelectItem[]>;
}
