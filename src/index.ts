import { convertFilesWithJson, convertFilesWithRegex } from "./jsonToCsv";
import { csvDataPath, jsonDataPath, isJestRunning } from "./utils";
import { existsSync, mkdirSync } from "fs";
import { readdir } from "fs/promises";

if (!isJestRunning() && !existsSync(csvDataPath)) {
  mkdirSync(csvDataPath);
}

// There are two convertion modes.
// REGEX mode is using stream Transform and each chunk is transformed using specific regex
// JSON mode is using JSONStream and event-stream. Each chunk is parsed to the object, properly stringified and returned

const CONVERTION_OPTIONS = {
  JSON: "JSON",
  REGEX: "REGEX",
};

// To use different convertion mode change convertion option below

const CONVERTION_MODE = CONVERTION_OPTIONS.REGEX;

const convertionFunction =
  CONVERTION_MODE === CONVERTION_OPTIONS.JSON
    ? convertFilesWithJson
    : convertFilesWithRegex;

(async function () {
  const promises = [];
  console.time("Converting time took");
  console.log(`Starting in ${CONVERTION_MODE} mode.`);
  try {
    const files = await readdir(jsonDataPath);
    if (files) {
      for (const file of files) {
        const csv = `${file.split(".json")[0]}.csv`;
        promises.push(
          convertionFunction(file, {
            in: `${jsonDataPath}/${file}`,
            out: `${csvDataPath}/${csv}`,
          })
        );
      }
      await Promise.all(promises).then(responses => {
        responses.forEach(res => console.log(res));
        console.timeEnd("Converting time took");
      });
    }
  } catch (error) {
    console.error(error);
  }
})();
