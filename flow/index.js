const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const manager = require("./routes/controller/manager");
const flowProvider = require("./routes/provider/flow.provider");
const utils = require("./utils/fs");

require("dotenv").config({
  path: require("path").resolve(__dirname, "./.env"),
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

                const result  = find
                  ? await flowProvider.update(data.request.userId, {
                      data: _data.data,
                    })
                  : flowProvider.insert(_data);
                  
                  callback(null, _data)
              },
            });
            break;
          case "NodeService":
            // Add gRPC methods for NodeService
            server.addService(service, {
              NewProcessForClient: async (data, callback) => {
                console.log("get hit here in New ProcessForClient");
                console.log('request from user ' + data.request.UserId)
                try{ 
                  const isRunning = await manager.isRunning(data.request.UserId)
                  console.log(isRunning);
                  if (!isRunning) {
                    const filename = await manager.getFlow(data.request.UserId);
                    const result = await manager.start(
                      filename,
                      data.request.UserId
                    );
                    console.log("returned info" + JSON.stringify(result));
                    callback(null, result);
                  } else {
                    callback(null, "Instance already running");
                  }
                }catch(e){
                  console.log(e);
                  console.log('something went wrong');
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

// Start the gRPC server with the specified link from environment variable
startGrpcServer(process.env.GRPC_LINK);
