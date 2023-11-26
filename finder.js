const fs = require("fs").promises;

async function findRecordById(
  filePath,
  id,
  idField = "id",
  arrayField = "data"
) {
  try {
    // Read the JSON file
    const data = await fs.readFile(filePath, "utf8");

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Find the record with the specified id
    const record =
      jsonData[arrayField].find((item) => item[idField] === id) || null;

    return record;
  } catch (err) {
    throw err; // Propagate the error to the calling code
  }
}

function filterKeysWithAllowList(record, allowedKeys) {
  // Filter the record based on the allowedKeys array
  const filteredRecord = Object.keys(record)
    .filter((key) => allowedKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = record[key];
      return obj;
    }, {});

  return filteredRecord;
}

module.exports = {
  findRecordById,
  filterKeysWithAllowList,
};
