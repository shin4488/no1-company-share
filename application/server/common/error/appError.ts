// https://future-architect.github.io/typescript-guide/exception.html
/**
 * このアプリの基底となる例外クラス
 * 新しい例外クラスを作成する際は、このクラスを継承してください
 */
export class AppError extends Error {
  private messages: string[];

  get errorMessages(): string[] {
    return this.messages;
  }

  constructor(...messages: string[]) {
    super();
    this.messages = messages;
    this.name = new.target.name;
    // 下記の行はTypeScriptの出力ターゲットがES2015より古い場合(ES3, ES5)のみ必要
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
