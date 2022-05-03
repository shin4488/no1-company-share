const types = {
  LogHandler: Symbol.for('LogHandler'),
  SequelizeHandler: Symbol.for('SequelizeHandler'),

  SequelizeTransaction: Symbol.for('SequelizeTransaction'),
  CompanyMasterDao: Symbol.for('CompanyMasterDao'),
  UserMasterDao: Symbol.for('UserMasterDao'),
  DivisionMasterDao: Symbol.for('DivisionMasterDao'),

  ApiResponseHandler: Symbol.for('ApiResponseHandler'),
  OpenGraphService: Symbol.for('OpenGraphService'),
  OpenGraphLogic: Symbol.for('OpenGraphLogic'),
  DivisionSelectItemLogic: Symbol.for('DivisionSelectItemLogic'),

  SharedPostService: Symbol.for('SharedPostService'),
  CompanyService: Symbol.for('CompanyService'),
  CompanyLogic: Symbol.for('CompanyLogic'),
  UserService: Symbol.for('UserService'),
  DivisionService: Symbol.for('DivisionService'),
};

export { types };
