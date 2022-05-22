/**
 * APIレスポンス用の選択リスト型
 * APIレスポンスはnull許容前提とするため、SelectItem型とは別でデータ型を作成
 */
export interface ApiSelectItem {
  /**
   * 画面表示用のテキスト
   */
  text: string | null;
  /**
   * 内部処理用の値
   */
  value: string | null;
}
