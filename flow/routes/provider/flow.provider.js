const flowModel = require("../models/flow.model");

exports.insert = async (data) => {
  data.isRunning = false;
  const result = await flowModel.create(data);
  return { id: result._id };
};

exports.listExpress = (req, res) => {
  let limit =
    req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  if (req.query) {
    if (req.query.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
  }
  flowModel.list(limit, page).then((result) => {
    res.status(200).send(result);
  });
};

exports.list = async () => {
  return await flowModel.list();
};

exports.getByIdExpress = (req, res) => {
  flowModel.findById(req.params.userId).then((result) => {
    res.status(200).send(result);
  });  
};


exports.getById = async (id) => {
  return await flowModel.findById(id);
};

exports.update = async (id, data) => {
  return await flowModel.patchFlowByUserId(id, data);
};
