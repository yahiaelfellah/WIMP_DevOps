const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const databaseUrl = process.env.MARIADB_URL || 'mysql://localhost:3306/WIMPv2_users';

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'mariadb',
  dialectOptions: {
    // Your MariaDB dialect options here
  },
  username: process.env.MARIADB_USER,        // Set the username from environment variables
  password: process.env.MARIADB_PASSWORD,    // Set the password from environment variables
});


const Identity = sequelize.define('Users', {
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  birthday: DataTypes.DATE,
  userName: DataTypes.STRING,
  password: DataTypes.STRING,
  permissionLevel: DataTypes.INTEGER,
  departement: DataTypes.STRING,
  isActive: DataTypes.BOOLEAN,
  status: DataTypes.JSON, // Assuming status is an array-like JSON field
  noderedInstance: DataTypes.BOOLEAN,
  flowExists: DataTypes.BOOLEAN,
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
    Identity.sync({ force: true })
      .then(() => {
        console.log("The table for the User model was just (re)created!");
      })
      .catch((err) => {
        console.error("Error syncing the User model:", err);
      });
  })
  .catch((error) => {
    console.error('Error creating the database:', error);
  });




exports.findByEmail = async (email) => {
  return await Identity.findAll({ where: { email: email } });
};

exports.findById = async (id) => {
  const user = await Identity.findByPk(id);
  if (user) {
    return user.toJSON();
  } else {
    return null;
  }
};

exports.findByUserName = async (name) => {
  return await Identity.findOne({ where: { userName: name } });
};

exports.createIdentity = async (userData) => {
  // Update default user data
  userData.isActive = true;
  userData.flowExists = false;
  return await Identity.create(userData);
};

exports.list = async (perPage, page) => {
  return await Identity.findAll({
    limit: perPage,
    offset: perPage * page,
  });
};

exports.putIdentity = async (id, data) => {
  const user = await Identity.findByPk(id);
  if (user) {
    await user.update(data);
    return user;
  } else {
    return null;
  }
};

exports.removeById = async (id) => {
  return await Identity.destroy({ where: { id: id } });
};

