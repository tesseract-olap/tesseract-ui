interface FormatLocale {
  separator: string;
  suffixes: string[];
  grouping: number[];
  delimiters: {
    thousands: string;
    decimal: string;
  },
  currency: string[];
}

type NumberFormatter = (d: number) => string;
