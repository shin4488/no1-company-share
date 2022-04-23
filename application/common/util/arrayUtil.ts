/**
 * 配列に関する共通処理
 */
export class ArrayUtil {
  /**
   * 配列が空である
   * @param values
   * @returns
   */
  public static isEmpty(values: unknown[]): boolean {
    return values === undefined || values === null || values.length === 0;
  }

  /**
   * 配列が空でない
   * @param values
   * @returns
   */
  public static isNotEmpty(values: unknown[]) {
    return !this.isEmpty(values);
  }
}
