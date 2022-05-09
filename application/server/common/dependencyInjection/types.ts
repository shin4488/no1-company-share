const types = {
  LogHandler: Symbol.for('LogHandler'),
  SequelizeHandler: Symbol.for('SequelizeHandler'),

  CompanyMasterDao: Symbol.for('CompanyMasterDao'),
  UserMasterDao: Symbol.for('UserMasterDao'),
  DivisionMasterDao: Symbol.for('DivisionMasterDao'),

  ApiResponseHandler: Symbol.for('ApiResponseHandler'),
  OpenGraphService: Symbol.for('OpenGraphService'),
  OpenGraphLogic: Symbol.for('OpenGraphLogic'),
  ExternalCompanyLogic: Symbol.for('ExternalCompanyLogic'),
  DivisionSelectItemLogic: Symbol.for('DivisionSelectItemLogic'),
  DateHandler: Symbol.for('DateHandler'),
  BadParameterErrorHandler: Symbol.for('BadParameterErrorHandler'),

  SharedPostService: Symbol.for('SharedPostService'),
  SharedPostSaveLogic: Symbol.for('SharedPostSaveLogic'),
  SharedPostComplexValidator: Symbol.for('SharedPostComplexValidator'),
  CompanyService: Symbol.for('CompanyService'),
  CompanyLogic: Symbol.for('CompanyLogic'),
  UserService: Symbol.for('UserService'),
  DivisionService: Symbol.for('DivisionService'),
};

export { types };
