import { csvDataPath, jsonDataPath, readDataFiles } from "./utils";
import { convertFiles, convertFilesAlt } from "./jsonToCsv";
import { existsSync, mkdirSync } from "fs";
const header = [
  "_id",
  "age",
  "eyeColor",
  "name",
  "gender",
  "company",
  "email",
  "phone",
  "address",
];

if (!existsSync(csvDataPath)) {
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
  CONVERTION_MODE === CONVERTION_OPTIONS.JSON ? convertFiles : convertFilesAlt;

let seconds = 0;
let interval: NodeJS.Timer;
const incrementSeconds = () => (seconds += 1);

(async function () {
  const promises = [];
  interval = setInterval(incrementSeconds, 1000);
  console.log(`Starting in ${CONVERTION_MODE} mode.`);
  try {
    const files = await readDataFiles();
    if (files) {
      for (const file of files) {
        const csv = `${file.split(".json")[0]}.csv`;
        promises.push(
          convertionFunction(header, {
            in: `${jsonDataPath}/${file}`,
            out: `${csvDataPath}/${csv}`,
          })
        );
      }
      await Promise.all(promises).then(responses => {
        responses.forEach(res => console.log(res));
        console.log(`Converting files took ${seconds} seconds`);
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    clearInterval(interval);
  }
})();
