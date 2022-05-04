export class Message {
  static notEmpty = '必須項目です。';
  static isString = '文字列を入力してください。';
  static invalidUrl = '有効なURLを入力してください。';
  static maxLength(length: number): string {
    return `${length}文字以下で入力してください。`;
  }

  static equalLength(length: number): string {
    return `${length}文字で入力してください。`;
  }
}
