const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "../proto/process.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const NodeService = grpc.loadPackageDefinition(packageDefinition).NodeService;

const client = new NodeService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

client.NewProcessForClient(
  { UserId: "6470d4a18ba660b67833cc17" },
  (error, news) => {
    console.log(news);
  }
);