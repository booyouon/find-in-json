const { findRecordById, filterKeysWithAllowList } = require("../finder");

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

describe("filterKeysWithAllowList", () => {
  test("filters keys based on allow list", () => {
    const record = { id: 1, name: "Record 1", age: 25 };
    const allowedKeys = ["id", "name"];
    const filteredRecord = filterKeysWithAllowList(record, allowedKeys);

    expect(filteredRecord).toEqual({ id: 1, name: "Record 1" });
  });
});
