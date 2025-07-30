const fs = require("fs/promises");
const path = require("path");
const dbPath = path.resolve("data", "db.json");

exports.readFile = async () => {
  const data = await fs.readFile(dbPath);
  const output = JSON.parse(data);
  // console.log("Data read from file:", output);
  return output;
};

exports.writeFile = async (data) => {
  const jsonData = JSON.stringify(data, null, 2);
  // console.log("Writing data to file:", jsonData);
  await fs.writeFile(dbPath, jsonData);
};
