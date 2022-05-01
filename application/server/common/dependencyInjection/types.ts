const types = {
  LogHandler: Symbol.for('LogHandler'),
  SequelizeHandler: Symbol.for('SequelizeHandler'),
  ApiResponseHandler: Symbol.for('ApiResponseHandler'),

  CompanyMasterDao: Symbol.for('CompanyMasterDao'),

  SharedPostService: Symbol.for('SharedPostService'),
  OpenGraphService: Symbol.for('OpenGraphService'),
  OpenGraphLogic: Symbol.for('OpenGraphLogic'),
  CompanyService: Symbol.for('CompanyService'),
  CompanyLogic: Symbol.for('CompanyLogic'),
};

export { types };
