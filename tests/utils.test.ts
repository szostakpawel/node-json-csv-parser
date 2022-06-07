import { RowObject } from "../src/types";

import {
  prepareRow,
  readDataFiles,
  getObjectValues,
  stringifyJsonChunk,
} from "../src/utils";

const testingObject: RowObject = {
  _id: "29x8afs7230",
  name: "John",
  age: 16,
};

describe("Utility functions", () => {
  it("getObjectValues", () => {
    const values = getObjectValues(testingObject);
    expect(values).toHaveLength(3);
    expect(values).toEqual(["29x8afs7230", "John", 16]);
  });
  it("prepareRow", () => {
    const values = getObjectValues(testingObject);
    const row = prepareRow(values);
    expect(row).toEqual("29x8afs7230,John,16" + "\n");
  });
  it("stringifyJsonChunk", () => {
    const row = stringifyJsonChunk(testingObject);
    expect(row).toEqual("29x8afs7230,John,16" + "\n");
  });
  it("readDataFiles with valid path", async () => {
    const files = await readDataFiles("./tests/resources");
    expect(files).toEqual(expect.arrayContaining(["testingJson.json"]));
  });
  it("readDataFiles with invalid path", async () => {
    const files = await readDataFiles("./tests/r3sourc3s");
    expect(files).toBeNull();
  });
});
