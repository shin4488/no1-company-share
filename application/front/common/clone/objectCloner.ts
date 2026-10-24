import clonedeep from 'lodash.clonedeep';

/**
 * オブジェクトのクローンを行うクラス
 */
export class ObjectCloner {
  deepClone<T>(value: T): T {
    return clonedeep(value);
  }
}
