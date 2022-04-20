import { Sequelize } from 'sequelize';

export interface SequelizeHandler {
  // getterをreadonlyで表している
  readonly sequelize: Sequelize;
}
