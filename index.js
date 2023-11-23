const express = require("express");
const bodyParser = require("body-parser");
const { findRecordById } = require("./finder");

const app = express();
const port = 3000;

const filePath = "./testdata.json";

app.use(bodyParser.json());

app.get("/getRecord/:id", async (req, res) => {
  try {
    // Find the record with the specified id using the external service
    const record = await findRecordById(filePath, req.params.id);

    // Check if the record was found
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Check if an allowedKeys array is provided in the request body
    const allowedKeys = req.body.allowedKeys;

    // If allowedKeys is provided, filter the record based on it
    if (allowedKeys && Array.isArray(allowedKeys)) {
      const filteredRecord = Object.keys(record)
        .filter((key) => allowedKeys.includes(key))
        .reduce((obj, key) => {
          obj[key] = record[key];
          return obj;
        }, {});

      return res.json({ record: filteredRecord });
    }

    // If allowedKeys is not provided, return the entire record
    res.json({ record });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
