const { Sequelize, DataTypes } = require('sequelize');
const databaseUrl = process.env.MARIADB_URL || 'mysql://localhost:3306/WIMPv2_flows';

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

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
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
      Flow.sync({ force: true })
        .then(() => {
          console.log("The table for the Flow model was just (re)created!");
        })
        .catch((err) => {
          console.error("Error syncing the Flow model:", err);
        });
    })
    .catch((error) => {
      console.error('Error creating the database:', error);
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

