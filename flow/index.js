const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const manager = require("./routes/controller/manager");
const flowProvider = require("./routes/provider/flow.provider");

const flowRouter = require("./routes/route.config");

const utils = require("./utils/fs");
const express = require("express");

require("dotenv").config({
  path: require("path").resolve(__dirname, "./.env"),
});

// Create an Express app
const app = express();

// Define a route for health check or other purposes
app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy");
});

const templatePath = require("path").resolve(__dirname, "./template/flow.json");

// Start the gRPC server with the specified server link
function startGrpcServer(serverlink) {
  const protoPaths = [
    "./proto/process.proto",
    "./proto/flow.proto", // Add more proto paths here
  ];

  const server = new grpc.Server();

  // Load and add gRPC services based on proto files
  protoPaths.forEach((protoPath) => {
    const packageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const loadedProto = grpc.loadPackageDefinition(packageDefinition);

    for (const serviceName in loadedProto) {
      if (
        loadedProto.hasOwnProperty(serviceName) &&
        serviceName.includes("Service")
      ) {
        const service = loadedProto[serviceName].service;
        switch (serviceName) {
          case "FlowService":
            // Add gRPC methods for FlowService
            server.addService(service, {
              Add: async (data, callback) => {
                console.log(data.request.data);
                // Check if the data flow exists otherwise we upload from the template
                let _data;
                if (data.request.data === "") {
                  try {
                    /// load the flow from the template folder
                    const res = await utils.readFile(templatePath);
                    _data = {
                      ...data.request,
                      data: res,
                    };
                    // add data to the request
                  } catch (ex) {
                    console.error(ex);
                  }
                }
                // Check if the user exists in the database already
                const find = await flowProvider.getById(data.request.userId);

                find
                  ? await flowProvider.update(data.request.userId, {
                      data: _data.data,
                    })
                  : flowProvider.insert(_data);

                callback(null, _data);
              },
              Delete: async (data, callback) => {
                // Check if the user exists in the database already
                const find = await flowProvider.getById(data.request.userId);
                find
                  ? await flowProvider.update(data.request.userId, {
                      isRunning: false,
                    })
                  : flowProvider.insert(_data);

                callback(null, _data);
              },
            });
            break;
          case "NodeService":
            // Add gRPC methods for NodeService
            server.addService(service, {
              NewProcessForClient: async (data, callback) => {
                console.log("get hit here in New ProcessForClient");
                console.log("request from user " + data.request.UserId);
                try {
                  const isRunning = await manager.isRunning(
                    data.request.UserId
                  );
                  if (!isRunning) {
                    const filename = await manager.getFlow(data.request.UserId);
                    const result = await manager.start(
                      filename,
                      data.request.UserId
                    );
                    console.log("returned info" + JSON.stringify(result));
                    callback(null, result);
                  } else {
                    callback(null, {
                      userId: data.request.UserId,
                      isRunning: true,
                    });
                  }
                } catch (e) {
                  console.log(e);
                  console.log("something went wrong");
                }
              },
            });
            break;
          default:
            console.log("Something went wrong");
            break;
        }
      }
    }
  });

  // Bind and start the gRPC server
  server.bindAsync(
    serverlink,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error("Error binding to port:", error);
        return;
      }

      console.log("Server at port:", port);
      console.log("Server running at " + serverlink);
      server.start();
    }
  );
}

// Clear Data Folder
//utils.clearFolder();

try {
  flowRouter.routesConfig(app);

  //Start the Express server on a specific port
  app.listen(process.env.EXPRESS_PORT, () => {
    console.log("Express server is running on " + process.env.EXPRESS_PORT);
    // Start the gRPC server with the specified link from environment variable
    startGrpcServer("0.0.0.0:"+ process.env.GRPC_PORT);

  });
} catch {
  console.log("Express app did not start");
}
