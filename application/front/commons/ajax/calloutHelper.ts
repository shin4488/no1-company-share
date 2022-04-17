/**
 * Httpコールアウトの共通クラス
 */
export class CalloutHepler {
  /**
   * サンプルメソッド
   */
  sayHello(value: string): string {
    console.log(`hello ${value}`);
    return `this is returned ${value}`;
  }
}
