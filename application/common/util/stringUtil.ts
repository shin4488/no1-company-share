/**
 * 文字列の共通処理
 */
export class StringUtil {
  /**
   * テキストが空か
   * @param text
   * @returns
   */
  public static isEmpty(text: string | undefined | null): boolean {
    return text === null || text === undefined || text === '';
  }

  /**
   * テキストが非空か
   * @param text
   * @returns
   */
  public static isNotEmpty(text: string | undefined | null): boolean {
    return !this.isEmpty(text);
  }

  /**
   * 数値を文字に変換
   * @param value
   * @returns
   */
  public static toString(value: number | undefined | null): string {
    return value === null || value === undefined ? '' : value.toString();
  }
}
