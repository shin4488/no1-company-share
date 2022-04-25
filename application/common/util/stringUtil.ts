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

  /**
   * 文字列がisEmptyなら 他方の値を返します。
   * @param value
   * @param elseValue
   */
  public static ifEmpty(
    value: string | null | undefined,
    elseValue: string = '',
  ): string {
    return value === null || value === undefined || value === ''
      ? elseValue
      : value;
  }

  /**
   * 非空の要素を連結し、一つの文字列にします。
   * @param separator セパレータ
   * @param args 要素一覧
   */
  public static joinNotEmpty(separator: string, ...args: unknown[]) {
    const filterd = args.filter(
      (x) => !(x === null || x === undefined || x === ''),
    );
    return filterd.join(separator);
  }
}
