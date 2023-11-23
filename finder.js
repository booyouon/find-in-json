const fs = require("fs").promises;

async function findRecordById(filePath, id) {
  try {
    // Read the JSON file
    const data = await fs.readFile(filePath, "utf8");

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Find the record with the specified id
    const record = jsonData.data.find((item) => item.id === id) || null;

    return record;
  } catch (err) {
    throw err; // Propagate the error to the calling code
  }
}

module.exports = {
  findRecordById,
};
