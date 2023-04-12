import {parseNumeric} from "./string";
import {Annotated} from "./types";

/**
 * Wraps `Object.keys` for reusability.
 */
export function getKeys<T>(map: {[s: string]: T}): string[] {
  return Object.keys(map);
}

/**
 * Wraps `Object.values` for reusability.
 */
export function getValues<T>(map: {[s: string]: T}): T[] {
  return Object.values(map);
}

/**
 * Safe method to check if an object contains a property.
 */
export function hasOwnProperty(obj: any, property: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, property);
}

/**
 * Parse and convert order value from an schema object
 * (that supports annotations) to an integer value.
 * If null return a big number: 99
 */
export function getOrderValue<T extends Annotated>(schemaObject: T) {
  const value = schemaObject.annotations.order || "NaN";
  return parseNumeric(value, 99);
}
