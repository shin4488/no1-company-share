export class Message {
  static isString = '文字列を入力してください。';
  static invalidUrl = '有効なURLを入力してください。';
  static maxLength(length: number): string {
    return `${length}文字以下で入力してください。`;
  }
}
