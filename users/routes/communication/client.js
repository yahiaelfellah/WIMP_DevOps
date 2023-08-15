const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROCESS_PROTO_PATH = require("path").resolve(
  __dirname,
  "./proto/process.proto"
);
const FLOW_PROTO_PATH = require('path').resolve(__dirname, "./proto/flow.proto");

function createProcessGRPCClient() {
  const processOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };

  const processPackageDefinition = protoLoader.loadSync(
    PROCESS_PROTO_PATH,
    processOptions
  );
  const ProcessService = grpc.loadPackageDefinition(
    processPackageDefinition
  ).NodeService;

  const processClient = new ProcessService(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );
  return processClient;
}

function createFlowGRPCClient() {
  const userOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };

  const userPackageDefinition = protoLoader.loadSync(
    FLOW_PROTO_PATH,
    userOptions
  );

  const FlowService = grpc.loadPackageDefinition(
    userPackageDefinition
  ).FlowService;

  const flowClient = new FlowService(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );
  return flowClient;
}

const processClient = createProcessGRPCClient();
const flowClient = createFlowGRPCClient()


function createNodeProcess(userId, callback) {
  processClient.NewProcessForClient({ UserId: userId }, (error, news) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, news);
    }
  });
}

function insertFlow(userId, data) {
  flowClient.Add({ userId: userId, data: data }, (error, user) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, user);
    }
  });
}

module.exports = {
  createNodeProcess,
  insertFlow,
};
