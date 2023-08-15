const express = require("express");
const RED = require("node-red");
const http = require("http");
const bodyParser = require("body-parser");
const app = express();
const server = http.createServer(app);
const provider = require('../provider/flow.provider');

// Extract command-line argument for userDir
const [, , flow, userId] = process.argv;



function getRandomFolderName(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let folderName = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    folderName += charset.charAt(randomIndex);
  }
  return folderName;
}

const thisProcessFolderName = getRandomFolderName(10)

// Create the settings object based on command-line arguments
const settings = {
  httpAdminRoot: "/red",
  httpNodeRoot: "/api",
  httpNodeCors: true,
  userDir: require('path').resolve(`./data/${thisProcessFolderName}/`),
  flowFile: flow,
  editorTheme: {
    tours: false, // To disable the welcome tour
  },
  functionGlobalContext: {
    os: require("os"),
  }, // enables global context
};

// Initialise the runtime with a server and settings
RED.init(server, settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot, RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot, RED.httpNode);
app.use(bodyParser.json());
app.get("/", (_req, res) => {
  res.status(200).send("is runnning");
});

// Route to clear flows
app.get("/clear", (req, res) => {
  if (RED.nodes.isStarted()) {
    RED.nodes.clear();
    res.status(200).send("Flows cleared successfully");
  } else {
    res.status(500).send("Node-RED runtime is not ready");
  }
});

// Get the server's address and port
server.listen(0, async () => {
  const serverAddress = server.address();
  const serverPort = serverAddress.port;
  console.log(serverAddress);
  console.log("Node Red Server listening on port:", serverPort);
  console.log(
    "Node-RED URL:",
    `http://${serverAddress.address}:${serverPort}${settings.httpAdminRoot}`
  );
  
  await provider.update(userId,{port:serverAddress.port, address:serverAddress.address })

  // Start the Node-RED server
  RED.start();
});

// Stop Node-RED process
function stopNodeRED() {
  RED.stop()
    .then(() => {
      console.log("Node-RED process stopped.");
      server.close(() => {
        console.log("Server closed.");
      });
    })
    .catch((error) => {
      console.error("Error stopping Node-RED process:", error);
    });
}

// Handle process termination
process.on("SIGINT", () => {
  console.log("Received SIGINT signal. Stopping Node-RED...");
  stopNodeRED();
});
