import { UserSaveParameter } from '../definition/userSaveParameter';

export interface UserService {
  save(parameter: UserSaveParameter): Promise<void>;
}
