const { findRecordById } = require("../finder");

describe("findRecordById", () => {
  const filePath = "./testdata.json";
  it("should find a record by id", async () => {
    const idToFind = "306";
    const record = await findRecordById(filePath, idToFind);

    // Assert that the record is found and has the correct id
    expect(record).toBeDefined();
    expect(record.id).toEqual(idToFind);
  });

  it("should return null for non-existing id", async () => {
    const nonExistingId = "999";
    const record = await findRecordById(filePath, nonExistingId);

    // Assert that the record is not found (null)
    expect(record).toBeNull();
  });
});
