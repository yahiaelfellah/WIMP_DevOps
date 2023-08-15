const fs = require("fs/promises"); // Using fs promises API
const path = require("path");
// Folder name to create
const folder = "./data";
const folderPath = path.resolve(__dirname, "../data");

exports.clearFolder = async () => {
  if (!await this.exists(folderPath)) {
    console.error(`Folder "${folderPath}" does not exist.`);
    return;
  }

  try {
    const list = await fs.readdir(folderPath);
    for (const file of list) {
      const currentPath = path.join(folderPath, file);
      const stats = await fs.lstat(currentPath);
      if (stats.isDirectory()) {
        // Recursively clear subdirectories
        await this.clearFolder(currentPath);
      } else {
        // Remove file
        await fs.unlink(currentPath);
        console.log(`Deleted file: ${currentPath}`);
      }
    }

    // Do not remove the root folder
    if (folderPath !== path.resolve(__dirname, "../data")) {
      await fs.rmdir(folderPath);
      console.log(`Deleted folder: ${folderPath}`);
    } else {
      console.log(`Skipped deleting root folder: ${folderPath}`);
    }
  } catch (err) {
    console.error(`Error while clearing folder "${folderPath}": ${err.message}`);
  }
};


exports.readFile = async(filePath) => {
  if(this.exists(filePath)){
    return await fs.readFile(filePath,'utf8')
  }
  return null;
}


// Check if a file or folder exists at the given path
exports.exists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true; // File exists
  } catch (error) {
    return false; // File doesn't exist
  }
};

exports.createFolder = async () => {
  try {
    await fs.mkdir(folder, { recursive: true });
    console.log("Folder created successfully");
  } catch (err) {
    console.error("Error creating folder:", err);
    throw err; // Rethrow the error to be caught in the caller function if needed
  }
};

// Create a JSON file with the provided data
exports.createJsonFile = async (data, filename) => {
  const jsonObject = JSON.parse(data); // Convert JSON string to JavaScript object
  const jsonString = JSON.stringify(jsonObject, null, 2); // Convert JavaScript object to JSON string with indentation
  const filepath = path.join(folder, filename);

  try {
    await fs.writeFile(filepath, jsonString, "utf-8");
    console.log("JSON file has been created successfully!");
    return filename;
  } catch (err) {
    console.error("Error writing JSON file:", err);
    throw err; // Rethrow the error to be caught in the caller function if needed
  }
};
