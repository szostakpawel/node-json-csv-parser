export type RowArray = Array<string | number>;

export type RowObject = Record<string, string | number>;

export type ParsedChunk =
  | Array<Record<string, string | number>>
  | Record<string, string | number>;

export interface Paths {
  in: string;
  out: string;
}
