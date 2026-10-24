/**
 * サイドバーの要素
 */
export interface SidebarItem {
  icon: string;
  title: string;
  to: string;
}

/**
 * デフォルトレイアウトのデータ
 */
export interface DefaultData {
  isDrawerOpened: boolean;
  isDrawerMini: boolean;
  title: string;
  sideBarItems: SidebarItem[];
}
