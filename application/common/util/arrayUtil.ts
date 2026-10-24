/**
 * 配列に関する共通処理
 */
export class ArrayUtil {
  public static isEmpty(values: unknown[] | null | undefined): boolean {
    return values === undefined || values === null || values.length === 0;
  }

  public static isNotEmpty(values: unknown[] | null | undefined) {
    return !this.isEmpty(values);
  }
}
