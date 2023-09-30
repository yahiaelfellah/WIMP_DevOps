const { Sequelize, DataTypes } = require('sequelize');
require("dotenv").config({ path: require('path').resolve(__dirname, "../../.env") });

const databaseUrl = process.env.MARIADB_URL || 'mysql://localhost:3306/WIMPv2_users';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'mariadb',
  dialectOptions: {
    // Your MariaDB dialect options here
  },
  username: process.env.MARIADB_USER,        // Set the username from environment variables
  password: process.env.MARIADB_PASSWORD,    // Set the password from environment variables
});
const Flow = sequelize.define('flows', {
  userId: DataTypes.STRING,
  pid: DataTypes.INTEGER,
  port: DataTypes.INTEGER,
  data: DataTypes.STRING,
  address: DataTypes.STRING,
  isRunning: DataTypes.BOOLEAN,
}, {
  timestamps: false, // Disable timestamps if not needed
});

  async function createDatabase() {
    try {
      // Create the database if it doesn't exist
      await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${sequelize.config.database}`);
      return true;
    } catch (error) {
      throw error;
    }
  }
  
  async function syncModel() {
    try {
      // Sync the model with the database, altering it if needed
      await sequelize.sync({ alter: true });
      console.log("The table for the User model was just (re)created!");
    } catch (error) {
      console.error("Error syncing the User model:", error);
    }
  }
  async function checkIfDatabaseExists() {
    try {
      // Check if the database exists by trying to authenticate with it
      await sequelize.authenticate();
      console.log('Table exits i guess');
      return true;
    } catch (error) {
      if (error.name === 'SequelizeConnectionError') {
        return false;
      }
      throw error;
    }
  }
  
  
  // Check if the database exists
  checkIfDatabaseExists()
    .then((exists) => {
      if (exists) {
        // Database already exists, proceed to sync the model
        syncModel();
      } else {
        // Database doesn't exist, create it and then sync the model
        createDatabase()
          .then(() => syncModel())
          .catch((error) => {
            console.error('Error creating the database:', error);
          });
      }
    })
    .catch((error) => {
      console.error('Error checking if the database exists:', error);
    });
  
  


exports.findById = async (id) => {
  return await Flow.findOne({ where: { userId: id } });
};

exports.create = async (data) => {
  try {
    return await Flow.create(data);
  } catch (err) {
    return null;
  }
};

exports.list = async (perPage, page) => {
  return await Flow.findAll({
    limit: perPage,
    offset: perPage * page,
  });
};

exports.patchFlowByUserId = async (id, data) => {
  const flow = await Flow.findOne({ where: { userId: id } });
  if (flow) {
    await flow.update(data);
    return flow;
  } else {
    return null;
  }
};

