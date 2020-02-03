import formUrlDecode from "form-urldecoded";
import formUrlEncode from "form-urlencoded";
import {hydrateState} from "./hydrate";
import {serializeState} from "./serialize";

/**
 * @param {QueryParams} query
 * @returns {string}
 */
export function serializePermalink(query) {
  return formUrlEncode(serializeState(query), {
    ignorenull: true,
    skipIndex: false,
    sorted: true
  });
}

/**
 * @param {string} searchString
 * @returns {QueryParams}
 */
export function hydratePermalink(searchString) {
  return hydrateState(formUrlDecode(searchString));
}
