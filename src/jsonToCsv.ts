import {
  prepareRow,
  prepareHeader,
  transformChunk,
  stringifyJsonChunk,
} from "./utils";
import { createReadStream, createWriteStream } from "fs";
import { Paths, RowObject } from "./types";
import JSONStream from "jsonstream";
import { map } from "event-stream";
import { Transform } from "stream";

const encoding: BufferEncoding = "utf-8";

const mapPipedData = map((data: RowObject, callback: Function) => {
  const strigified = stringifyJsonChunk(data);
  callback(null, strigified);
});

export const convertFilesWithJson = (fileName: string, paths: Paths) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = createReadStream(paths.in, encoding);
      const writer = createWriteStream(paths.out, encoding);

      let header: Array<string> = [];

      reader.once("data", data => {
        const dataString = typeof data === "string" ? data : data.toString();
        header = prepareHeader(dataString);
      });

      writer.on("open", () => writer.write(prepareRow(header)));
      writer.on("error", error => console.error(error));
      writer.on("close", () =>
        resolve(`File ${fileName} was successfully converted and saved.`)
      );

      reader.pipe(JSONStream.parse("*")).pipe(mapPipedData).pipe(writer);
    } catch (error) {
      console.error(error);
      reject(`Cannot convert file ${fileName}`);
    }
  });
};

export const convertFilesWithRegex = (fileName: string, paths: Paths) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = createReadStream(paths.in, encoding);
      const writer = createWriteStream(paths.out, encoding);

      let header: Array<string> = [];

      reader.once("data", data => {
        const dataString = typeof data === "string" ? data : data.toString();
        header = prepareHeader(dataString);
      });

      const transform = new Transform({
        transform(chunk, _, done) {
          const transformed = transformChunk(chunk);
          done(null, transformed);
        },
      });

      writer.on("open", () => writer.write(prepareRow(header)));
      writer.on("error", error => console.error(error));
      writer.on("close", () =>
        resolve(`File ${fileName} was successfully converted and saved.`)
      );

      reader.pipe(transform).pipe(writer);
    } catch (error) {
      console.error(error);
      reject("There is a problem with files convertion");
    }
  });
};
