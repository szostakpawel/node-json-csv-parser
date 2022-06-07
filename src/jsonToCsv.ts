import { createReadStream, createWriteStream } from "fs";
import { stringifyJsonChunk, prepareRow } from "./utils";
import { Header, Paths, RowObject } from "./types";
import JSONStream from "jsonstream";
import { map } from "event-stream";
import { Transform } from "stream";

const encoding: BufferEncoding = "utf-8";

const mapPipedData = map((data: RowObject, callback: Function) => {
  const strigified = stringifyJsonChunk(data);
  callback(null, strigified);
});

export const convertFiles = (header: Header, paths: Paths) => {
  return new Promise((resolve, reject) => {
    const pathSplitted = paths.in.split("/");
    const fileName = pathSplitted[pathSplitted.length - 1];

    try {
      const reader = createReadStream(paths.in, encoding);
      const writer = createWriteStream(paths.out, encoding);

      writer.on("open", () => writer.write(prepareRow(header)));
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

// Alternative version with regex
export const convertFilesAlt = (header: Header, paths: Paths) => {
  return new Promise((resolve, reject) => {
    try {
      const transform = new Transform();
      const reader = createReadStream(paths.in, encoding);
      const writer = createWriteStream(paths.out, encoding);

      transform._transform = (chunk, _, done) => {
        const rows = chunk
          .toString()
          .replace(/("\w{1,}":)|[\r\n\s{[\]]/g, "")
          .replace(/},|}/g, "\n");

        done(null, rows);
      };

      writer.on("open", () => writer.write(header.join(",") + "\n"));
      writer.on("close", () =>
        resolve("All files were converted and saved successfully")
      );

      reader.pipe(transform).pipe(writer);
    } catch (error) {
      console.error(error);
      reject("There is a problem with files convertion");
    }
  });
};
