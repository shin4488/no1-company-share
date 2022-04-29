/**
 * サイドバーの要素
 */
export interface SidebarItem {
  icon: string;
  title: string;
  to: string;
}

/**
 * DefaultページのVueデータ
 */
export interface DefaultData {
  isDrawerOpened: boolean;
  isDrawerMini: boolean;
  title: string;
  firebaseUserIconImage: string;
  sideBarItems: SidebarItem[];
}
