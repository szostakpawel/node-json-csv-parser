import { prepareRow, isJestRunning, stringifyJsonChunk } from "../src/utils";
import { testingObject } from "./resources/testingResources";

describe("Utility functions", () => {
  it("getObjectValues", () => {
    const values = Object.values(testingObject);
    expect(values).toHaveLength(3);
    expect(values).toEqual(["29x8afs7230", "John", 16]);
  });
  it("prepareRow", () => {
    const values = Object.values(testingObject);
    const row = prepareRow(values);
    expect(row).toEqual("29x8afs7230,John,16" + "\n");
  });
  it("stringifyJsonChunk", () => {
    const row = stringifyJsonChunk(testingObject);
    expect(row).toEqual("29x8afs7230,John,16" + "\n");
  });
  it("isJestRunning", () => {
    expect(isJestRunning()).toBeTruthy();
  });
});
