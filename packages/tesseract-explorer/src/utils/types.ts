export interface Annotated {
  annotations: Record<string, string | undefined>;
}

export interface FileDescriptor {
  content: Blob | string;
  extension: string;
  name: string;
}

export type Formatter = (value: number) => string;

export interface JSONArrays {
  headers: string[];
  data: [string, ...(number | undefined)[]][];
}

export interface LevelDescriptor {
  dimension: string;
  hierarchy: string;
  level: string;
}
