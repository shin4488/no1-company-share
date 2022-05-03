const types = {
  LogHandler: Symbol.for('LogHandler'),
  SequelizeHandler: Symbol.for('SequelizeHandler'),

  SequelizeTransaction: Symbol.for('SequelizeTransaction'),
  CompanyMasterDao: Symbol.for('CompanyMasterDao'),
  UserMasterDao: Symbol.for('UserMasterDao'),

  ApiResponseHandler: Symbol.for('ApiResponseHandler'),
  OpenGraphService: Symbol.for('OpenGraphService'),
  OpenGraphLogic: Symbol.for('OpenGraphLogic'),
  SharedPostService: Symbol.for('SharedPostService'),
  CompanyService: Symbol.for('CompanyService'),
  CompanyLogic: Symbol.for('CompanyLogic'),
  UserService: Symbol.for('UserService'),
};

export { types };
