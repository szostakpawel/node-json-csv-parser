import { convertFilesWithJson, convertFilesWithRegex } from "../src/jsonToCsv";
import { testingHeader, testingPaths } from "./resources/testingResources";
import { existsSync, mkdirSync } from "fs";
import { readdir } from "fs/promises";

const validPromiseExpectations = async (promise: Promise<unknown>) => {
  const returnedInfo = await promise.then(res => res);
  expect(returnedInfo).toEqual(
    "File testingJson.json was successfully converted and saved."
  );
};

describe("Converting files", () => {
  let file: string;
  let csv: string;
  beforeEach(async () => {
    if (!existsSync(testingPaths.out)) {
      mkdirSync(testingPaths.out);
    }
    const files = await readdir(testingPaths.in);
    expect(files).toHaveLength(1);
    file = files[0];
    csv = `${file.split(".json")[0]}.csv`;
  });
  it("convertFilesWithJson", async () => {
    const promise = convertFilesWithJson(file, {
      in: `${testingPaths.in}/${file}`,
      out: `${testingPaths.out}/${csv}`,
    });
    await validPromiseExpectations(promise);
  });
  it("convertFilesWithRegex", async () => {
    const promise = convertFilesWithRegex(file, {
      in: `${testingPaths.in}/${file}`,
      out: `${testingPaths.out}/${csv}`,
    });
    await validPromiseExpectations(promise);
  });
});
