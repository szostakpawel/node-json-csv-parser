import { readdir } from "fs/promises";
import { RowArray, RowObject } from "./types";

export const jsonDataPath = "./src/data/json";
export const csvDataPath = "./src/data/csv";

export const readDataFiles = async (
  path = jsonDataPath
): Promise<string[] | null> => {
  try {
    const files = await readdir(path);
    return files;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const isJestRunning = (): boolean =>
  process.env.JEST_WORKER_ID !== undefined;

export const prepareRow = (array: RowArray): string => {
  return array.join(",") + "\n";
};

export const getObjectValues = (obj: RowObject): Array<string | number> => {
  const values: Array<string | number> = [];
  for (const key in obj) {
    values.push(obj[key]);
  }
  return values;
};

export const stringifyJsonChunk = (json: RowObject): string => {
  const values = getObjectValues(json);
  return prepareRow(values);
};
