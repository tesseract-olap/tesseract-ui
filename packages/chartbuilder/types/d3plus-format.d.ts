export as namespace d3plus;

export interface FormatLocale {
  separator: string;
  suffixes: string[];
  grouping: number[];
  delimiters: {
    thousands: string;
    decimal: string;
  },
  currency: string[];
}

export type NumberFormatter = (d: number) => string;
