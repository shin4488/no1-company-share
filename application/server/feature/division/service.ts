import { inject, injectable } from 'inversify';
import { No1DivisionSelectItemGetResponse } from './definition/no1DivisionSelectItemGetResponse';
import { DivisionService } from './interface/service';
import { types } from '@s/common/dependencyInjection/types';
import { DivisionSelectItemLogic } from '@s/commonBL/division/interface/divisionSelectItemLogic';

@injectable()
export class DivisionServiceImpl implements DivisionService {
  private divisionLogic: DivisionSelectItemLogic;

  constructor(
    @inject(types.DivisionSelectItemLogic)
    divisionLogic: DivisionSelectItemLogic,
  ) {
    this.divisionLogic = divisionLogic;
  }

  async getNo1DivisionSelectItems(): Promise<No1DivisionSelectItemGetResponse> {
    const divisionSelectItems =
      await this.divisionLogic.getDivisionSelectItemsByColumn('NO1_DIVISION');
    const response: No1DivisionSelectItemGetResponse = {
      no1DivisionSelectItems: divisionSelectItems,
    };
    return response;
  }
}
