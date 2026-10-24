/**
 * 文字列の共通処理
 */
export class StringUtil {
  public static isEmpty(text: string | undefined | null): boolean {
    return text === null || text === undefined || text === '';
  }

  public static isNotEmpty(text: string | undefined | null): boolean {
    return !this.isEmpty(text);
  }

  public static toString(value: number | undefined | null): string {
    return value === null || value === undefined ? '' : value.toString();
  }

  public static ifEmpty(
    value: string | null | undefined,
    elseValue: string = '',
  ): string {
    return value === null || value === undefined || value === ''
      ? elseValue
      : value;
  }
}
