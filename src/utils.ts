import { readdir, readFile } from "fs/promises";
import { RowArray, RowObject } from "./types";

export const jsonDataPath = "./src/data/json";
export const csvDataPath = "./src/data/csv";

export const getPositionInString = (
  string: string,
  subString: string,
  order: number
): number => {
  return string.split(subString, order).join(subString).length;
};

export const prepareHeader = (str: string): Array<string> => {
  const [starting, ending] = [
    getPositionInString(str, "{", 1),
    getPositionInString(str, "}", 1),
  ];
  const firstJsonObject = str.slice(starting, ending + 1);
  const parsed = JSON.parse(firstJsonObject);
  return Object.keys(parsed);
};

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
  const joined = array.join(",");
  return `${joined}${"\n"}`;
};

export const getObjectValues = (obj: RowObject): Array<string | number> => {
  const values: Array<string | number> = [];
  for (const key in obj) {
    values.push(obj[key]);
  }
  return values;
};

export const stringifyJsonChunk = (parsedJson: RowObject): string => {
  const values = getObjectValues(parsedJson);
  return prepareRow(values);
};

export const transformChunk = (chunk: string | Buffer) => {
  const { CLOSING_CURLY_BRACKET, OPENING_CURLY_BRACKET, QUOTES, WHITE_SPACES } =
    REGEXPS;
  const str = chunk.toString();
  const whiteSpaces = str.replace(WHITE_SPACES, "");
  const openingBracket = whiteSpaces.replace(OPENING_CURLY_BRACKET, "");
  const breakLines = openingBracket.replace(CLOSING_CURLY_BRACKET, "\n");
  const rowsWithoutQuotes = breakLines.replace(QUOTES, "");
  return rowsWithoutQuotes;
};

export const REGEXPS = {
  QUOTES: /((?<![\\])['"])/g,
  WHITE_SPACES: /("\w{1,}":)|[\r\n\s[\]]/g,
  OPENING_CURLY_BRACKET: /},|{/g,
  CLOSING_CURLY_BRACKET: /},|}/g,
};
