import { ParsedQs } from 'qs';

export interface CompanyGetRequestQuery extends ParsedQs {
  companyName?: string;
}
