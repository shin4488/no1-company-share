/**
 * 文字列の共通処理
 */
export class StringUtil {
  /**
   * テキストが空か
   * @param text
   * @returns
   */
  static isEmpty(text: string): Boolean {
    return text === null || text === undefined || text === '';
  }
}
