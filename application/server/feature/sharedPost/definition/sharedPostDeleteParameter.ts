export interface SharedPostDeleteParameterItem {
  id: string;
}

export interface SharedPostDeleteParameter {
  userId: string;
  posts: SharedPostDeleteParameterItem[];
}
