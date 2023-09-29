const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const databaseUrl = process.env.MARIADB_URL || 'mysql://localhost:3306/WIMPv2_department';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'mariadb',
  dialectOptions: {
    // Your MariaDB dialect options here
  },
  username: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
});

const Department = sequelize.define('Department', {
  name: DataTypes.STRING,
  description: DataTypes.STRING,
}, {
  timestamps: true,
});

async function createDatabase() {
  try {
    await sequelize.sync({ alter: true }); // Use force: true to drop and recreate the database
    console.log('Database has been created.');
  } catch (error) {
    console.error('Error creating the database:', error);
  }
}

// Call createDatabase before defining and syncing the model
createDatabase()
  .then(() => {
    // Sync the model with the database
    Department.sync({ force: true })
      .then(() => {
        console.log("The table for the Department model was just (re)created!");
      })
      .catch((err) => {
        console.error("Error syncing the Department model:", err);
      });
  })
  .catch((error) => {
    console.error('Error creating the database:', error);
  });

exports.findById = async (id) => {
  const department = await Department.findByPk(id);
  if (department) {
    return department.toJSON();
  } else {
    return null;
  }
};

exports.createDepartment = async (departmentData) => {
  return await Department.create(departmentData);
};

exports.list = async (perPage, page) => {
  return await Department.findAll({
    limit: perPage,
    offset: perPage * page,
  });
};

exports.updateDepartment = async (id, data) => {
  const department = await Department.findByPk(id);
  if (department) {
    await department.update(data);
    return department;
  } else {
    return null;
  }
};

exports.removeById = async (id) => {
  return await Department.destroy({ where: { id: id } });
};
