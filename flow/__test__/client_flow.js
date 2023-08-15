const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "../proto/flow.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const FlowService = grpc.loadPackageDefinition(packageDefinition).FlowService;

const client = new FlowService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

const data = [
  {
    id: "54e1f57.fb11a0c",
    type: "tab",
    label: "Fitbit Versa 2",
    disabled: false,
    info: "",
  },
  {
    id: "eb9fbde9.fb4c7",
    type: "inject",
    z: "54e1f57.fb11a0c",
    name: "",
    props: [{ p: "payload" }, { p: "topic", vt: "str" }],
    repeat: "",
    crontab: "",
    once: false,
    onceDelay: 0.1,
    topic: "",
    payload: "",
    payloadType: "date",
    x: 280,
    y: 140,
    wires: [["488f6e58.eb915"]],
  },
  {
    id: "488f6e58.eb915",
    type: "function",
    z: "54e1f57.fb11a0c",
    name: "",
    func: "return Date.now();\n",
    outputs: 1,
    noerr: 0,
    initialize: "",
    finalize: "",
    x: 570,
    y: 120,
    wires: [["3bc005b0.9f0d5a"]],
  },
  {
    id: "3bc005b0.9f0d5a",
    type: "debug",
    z: "54e1f57.fb11a0c",
    name: "",
    active: true,
    tosidebar: true,
    console: false,
    tostatus: false,
    complete: "false",
    statusVal: "",
    statusType: "auto",
    x: 900,
    y: 160,
    wires: [],
  },
];

client.Add({ userId: '6470d4a18ba660b67833cc17', data: JSON.stringify(data) }, (_, res) => {
  console.log(res);
});

// client.KillAll({} , () => {
//   console.log('kill all processes')
// })
