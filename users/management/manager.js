const IdentityModel = require("../routes/models/identity.model");
const config = require("../security/env.config");
const Surfer = config.permissionLevels.Surfer;
const Master = config.permissionLevels.Master;
const request = require("supertest");
const {
  createNodeProcess,
  insertFlow
} = require("../routes/communication/client");

exports.AdminInit = async (app) => {
  const userAdmin = {
    firstName: "admin",
    lastName: "admin",
    userName: "admin",
    password: "adminpass",
    permissionLevel: Master,
  };
  const userList = await IdentityModel.list(0, 100);
  if (userList.filter((o) => o.firstName === "admin").length == 0) {
    await request(app)
      .post("/users")
      .send(userAdmin)
      .then((res) => {
        console.log("admin created with success");
      });
  }
  console.log("admin already created in Database");
  const admin = await IdentityModel.findByUserName("admin");
  /// Request a flow adding to DB for ADMIN
  insertFlow(admin.id, "", async (_, res) => {
    console.log("adding information in the flow data base");
    if (!_ && res) {
      await IdentityModel.putIdentity(res.userId, {
        flowExists: true,
      });
    } else {
      console.log(_);
    }
  });
};

exports.AdminInitPromise = async (app) => {
  return new Promise(async (resolve, reject) => {
    const userAdmin = {
      firstName: "admin",
      lastName: "admin",
      userName: "admin",
      password: "adminpass",
      permissionLevel: Master,
    };

    try {
      const userList = await IdentityModel.list(0, 100);

      if (userList.filter((o) => o.firstName === "admin").length === 0) {
        await request(app)
          .post("/users")
          .send(userAdmin)
          .then((res) => {
            console.log("admin created with success");
          });
      } else {
        console.log("admin already created in Database");
      }

      const admin = await IdentityModel.findByUserName("admin");

      // Request a flow adding to DB for ADMIN
      insertFlow(admin.id, "", async (_, res) => {
        console.log("adding information in the flow data base");
        if (!_ && res) {
          await IdentityModel.putIdentity(res.userId, {
            flowExists: true,
          });
        } else {
          console.log(_);
        }

        resolve(); // Resolve the Promise after everything is done
      });
    } catch (error) {
      reject(error); // Reject the Promise if an error occurs
    }
  });
};

// Loop module
exports.flow = async () => {
  try {
    while (true) {
      // Fetch data from the database
      const userList = await IdentityModel.list();
      userList.forEach((user) => {
        if (
          user.isActive &&
          (user.permissionLevel === Surfer || user.permissionLevel === Master)
        ) {
          if (!user.flowExists) {
            // Request a flow adding to DB for ADMIN
            insertFlow(user.id, "", async (_, res) => {
              console.log("adding information in the flow data base");
              if (!_ && res) {
                await IdentityModel.putIdentity(res.userId, {
                  flowExists: true,
                });
              } else {
                console.log(_);
              }
            });
          }
          // If user active and there's
          createNodeProcess(user.id, async (_, res) => {
            if (!_ && res && res.userId !== "") {
              await IdentityModel.putIdentity(res.userId, {
                noderedInstance: res.isRunning,
              });
            } else {
              console.log(res);
              console.log("something wrong");
            }
          });
          // Update Database
          // ;
        }
      });
      await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait for 30 seconds
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

