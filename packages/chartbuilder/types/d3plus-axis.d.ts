export as namespace d3plus;

declare module "d3plus-axis" {
  /**
   * Creates an SVG scale based on an array of data.
   */
  export class Axis extends d3plus.BaseClass<T> {}


  export class AxisBottom {}
  export class AxisLeft {}
  export class AxisRight {}
  export class AxisTop {}

  /**
   * Parses numbers and strings to valid Javascript Date objects.
   * Besides the 4-digit year parsing, this function is useful when needing to parse negative (BC) years, which the vanilla Date object cannot parse.
   * @param primitive A number (representing either a 4-digit year or milliseconds since epoch) or a string that is in [valid dateString format](http://dygraphs.com/date-formats.html).
   */
  export function date(primitive: string | number): Date;
}
