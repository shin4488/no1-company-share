import { StringUtil } from '@c/utils/stringUtil';

/**
 * Firebase用の認証処理
 */
export class FirebaseAuth {
  token: string = '';

  constructor(token: string) {
    this.token = token;
  }

  /**
   * JWTトークンが有効かを認証
   * @returns
   */
  validateToken() {
    console.log(StringUtil.isEmpty(this.token));
    console.log(`tokenddddaa1: ${this.token}`);
    console.log(`tokenddddaa2: ${this.token}`);
    return false;
  }
}
