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

export const isJestRunning = (): boolean =>
  process.env.JEST_WORKER_ID !== undefined;

export const prepareRow = (array: RowArray): string => {
  const joined = array.join(",");
  return `${joined}\n`;
};

export const stringifyJsonChunk = (parsedJson: RowObject): string => {
  const values = Object.values(parsedJson);
  return prepareRow(values);
};

export const transformChunk = (chunk: string | Buffer) => {
  const { QUOTES, CLOSING_CURLY_BRACKET, KEYS_AND_WHITE_SPACES } = REGEXPS;
  const str = chunk.toString();
  const whiteSpaces = str.replace(KEYS_AND_WHITE_SPACES, "");
  const breakLines = whiteSpaces.replace(CLOSING_CURLY_BRACKET, "\n");
  return breakLines.replace(QUOTES, "");
};

export const REGEXPS = {
  QUOTES: /((?<![\\])['"])/g,
  KEYS_AND_WHITE_SPACES: /("\w{1,}":)|[\r\n\s{[\]]/g,
  CLOSING_CURLY_BRACKET: /},|}/g,
};
