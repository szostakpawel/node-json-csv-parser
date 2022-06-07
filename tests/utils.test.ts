import {
  prepareRow,
  readDataFiles,
  isJestRunning,
  getObjectValues,
  stringifyJsonChunk,
} from "../src/utils";
import { testingObject, testingPaths } from "./resources/testingResources";

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
    const files = await readDataFiles(testingPaths.in);
    expect(files).toEqual(expect.arrayContaining(["testingJson.json"]));
  });
  it("readDataFiles with invalid path", async () => {
    const files = await readDataFiles("./tests/invalid");
    expect(files).toBeNull();
  });
  it("isJestRunning", () => {
    expect(isJestRunning()).toBeTruthy();
  });
});
