const { spawn } = require("child_process");
const NodeCache = require("node-cache");
const cache = new NodeCache(); // create a new cache instance
const childScriptPath = require("path").resolve(__dirname, "child.js"); // Adjust the path accordingly
const utils = require("../../utils/fs");
const provider = require("../provider/flow.provider");

exports.getFlow = async (userId) => {
  const filename = `${userId}_user.json`;

  try {
    // Create flow folder if not exists
    await utils.createFolder();

    // Check if file exists in the folder
    if (!(await utils.exists(filename))) {
      const result = await provider.getById(userId);
      return await utils.createJsonFile(result.data, filename);

    }
  } catch (error) {
    console.error("An error occurred:", error);
    // You might want to handle the error appropriately
  }
};

/**
 * Start A Node Red Instance
 */
exports.start = (path) => {
  const process = spawn("node", [childScriptPath,path], {
    stdio: "inherit", // This will use the same stdio as the parent process
    shell: true, // Use shell to execute the command
  });
  process.unref();
  process.on("error", (err) => {
    console.error("Failed to spawn Node-RED process:", err);
  });
  // Check if the Node-RED process is running
  if (process.pid !== null) {
    console.log("Running the process with PID " + process.pid);
    cache.set(`node-red-${process.pid}`, process);
    return process;
  }
  console.log("Node-RED process is not running");
  return null;
};
/**
 * Kill the Node Process
 * @param { String } pid
 */
exports.Close = (pid) => {
  const process = cache.get(`node-red-${pid}`);
  process.kill("SIGTERM");
  // Listen for the process to exit
  process.on("exit", (code, signal) => {
    console.info(
      `Node-RED process exited with code ${code} and signal ${signal}`
    );
  });
};

exports.Clear = () => {
  const keys = cache.keys(); // get a list of all keys in the cache
  for (const key of keys) {
    const process = cache.get(key);
    process.kill("SIGTERM");
  }
};
/**
 * Return the status of the Running Process
 * @returns
 */
exports.Status = () => {
  const keys = cache.keys(); // get a list of all keys in the cache
  const runningProcesses = [];
  for (const key of keys) {
    const value = cache.get(key);
    if (value && !value.killed) {
      runningProcesses.push(value.pid);
    }
  }
  return runningProcesses;
};
