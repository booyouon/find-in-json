const express = require("express");
const bodyParser = require("body-parser");

const multer = require("multer");
const fileFolder = "uploads/";
const upload = multer({ dest: fileFolder });

const {
  readFile,
  findRecordById,
  filterKeysWithAllowList,
  findAndDeleteByFilePath,
} = require("./finder");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Used to search through a json file and return the record with the specified id
app.post("/find", upload.single("uploaded_file"), async (req, res) => {
  try {
    const body = req.body;
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    // Find the record with the specified id using the external service
    const record = await findRecordById(
      fileFolder + req.file.filename,
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
  } finally {
    // Delete the uploaded file
    if (req.file) {
      findAndDeleteByFilePath(fileFolder + req.file.filename);
    }
  }
});

// Used to search through a json file and return the record with the specified id
app.post("/filter", upload.single("uploaded_file"), async (req, res) => {
  try {
    const body = req.body;
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const record = await readFile(fileFolder + req.file.filename);

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
  } finally {
    // Delete the uploaded file
    if (req.file) {
      findAndDeleteByFilePath(fileFolder + req.file.filename);
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
