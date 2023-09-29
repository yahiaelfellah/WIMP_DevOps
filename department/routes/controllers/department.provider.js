const DepartmentModel = require("../models/department.model.MariaDB");

exports.insert = async (req, res) => {
  DepartmentModel.createDepartment(req.body).then((result) => {
    res.status(201).send({ id: result.id });
  });
};

exports.list = (req, res) => {
  let limit =
    req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  if (req.query) {
    if (req.query.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
  }
  DepartmentModel.list(limit, page).then((result) => {
    res.status(200).send(result);
  });
};

exports.getById = (req, res) => {
  DepartmentModel.findById(req.params.departmentId).then((result) => {
    res.status(200).send(result);
  });
};

exports.putById = (req, res) => {
  DepartmentModel.updateDepartment(req.params.departmentId, req.body).then(
    (result) => {
      res.status(204).send({});
    }
  );
};

exports.removeById = (req, res) => {
  DepartmentModel.removeById(req.params.departmentId)
    .then((result) => {
      res.status(204).send({});
    })
    .finally(() => {
      // Additional logic here if needed
    });
};
