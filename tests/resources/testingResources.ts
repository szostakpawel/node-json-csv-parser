import { RowObject } from "../../src/types";

export const testingHeader = ["_id", "age", "gender", "name", "email"];

export const testingPaths = {
  in: "./tests/resources/json",
  out: "./tests/resources/csv",
};

export const testingObject: RowObject = {
  _id: "29x8afs7230",
  name: "John",
  age: 16,
};
