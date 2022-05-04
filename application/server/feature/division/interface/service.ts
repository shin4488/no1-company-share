import { No1DivisionSelectItemGetResponse } from '../definition/no1DivisionSelectItemGetResponse';

export interface DivisionService {
  getNo1DivisionSelectItems(): Promise<No1DivisionSelectItemGetResponse>;
}
