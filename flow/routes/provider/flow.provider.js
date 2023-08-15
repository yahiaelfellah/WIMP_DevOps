const flowModel = require("../models/flow.model");

exports.insert = async (data) => {
  const result = await flowModel.create(data);
  return { id: result._id };
};

exports.list = async () => {
  let page = 0;
  let limit = 10;
  return await flowModel.list(limit, page);
};

exports.getById = async (id) => {
  return await flowModel.findById(id);
};

exports.update = async (id, data) => {
  return await flowModel.patchFlowByUserId(id, data);
};
