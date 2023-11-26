const express = require("express");
const bodyParser = require("body-parser");
const {
  readFile,
  findRecordById,
  filterKeysWithAllowList,
} = require("./finder");

const app = express();
const port = 3000;

const filePath = "./testdata2.json";

app.use(bodyParser.json());

// Used to search through a json file and return the record with the specified id
app.post("/find", async (req, res) => {
  try {
    const body = req.body;
    // Find the record with the specified id using the external service
    const record = await findRecordById(
      filePath,
      body.id,
      body.idField,
      body.arrayField
    );

    // Check if the record was found
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Check if an allowedKeys array is provided in the request body
    const allowedKeys = body.allowedKeys;

    // If allowedKeys is provided, filter the record based on it
    if (allowedKeys && Array.isArray(allowedKeys)) {
      const filteredRecord = filterKeysWithAllowList(record, allowedKeys);
      return res.json({ record: filteredRecord });
    }

    // If allowedKeys is not provided, return the entire record
    res.json({ record });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Used to search through a json file and return the record with the specified id
app.post("/filter", async (req, res) => {
  try {
    const body = req.body;
    const record = await readFile(filePath);

    // Check if the record is empty
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    // Check if an allowedKeys array is provided in the request body
    const allowedKeys = body.allowedKeys;
    if (!allowedKeys || !Array.isArray(allowedKeys)) {
      return res.status(400).json({
        message:
          "allowedKeys must be included in the body and must be an array of strings",
      });
    }
    // If allowedKeys is provided, filter the record based on it
    const filteredRecord = filterKeysWithAllowList(record, allowedKeys);
    res.json({ record: filteredRecord });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/read", async (req, res) => {
  console.log(req.body);
  res.json({ message: "Hello World!" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
