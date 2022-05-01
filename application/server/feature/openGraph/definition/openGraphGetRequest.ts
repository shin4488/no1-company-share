import { ParsedQs } from 'qs';

/**
 * Open Graph取得リクエスト
 */
export interface openGraphGetRequest extends ParsedQs {
  pageUris: string[] | undefined;
}
