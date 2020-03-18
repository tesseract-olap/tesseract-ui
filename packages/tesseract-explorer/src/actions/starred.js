export const STARRED_CREATE = "explorer/STARRED/CREATE";
export const STARRED_INYECT = "explorer/STARRED/INYECT";
export const STARRED_REMOVE = "explorer/STARRED/REMOVE";
export const STARRED_UPDATE = "explorer/STARRED/UPDATE";

/**
 * @param {import("../reducers").QueryState} query
 * @param {string} permalink
 */
export function createStarredItem(query, permalink) {
  return {
    type: STARRED_CREATE,
    payload: {date: new Date().toISOString(), key: permalink, label: "", query}
  };
}

/** @param {string} payload */
export function removeStarredItem(payload) {
  return {type: STARRED_REMOVE, payload};
}

/** @param {import("../reducers").StarredItem} payload */
export function updateStarredItemLabel(payload) {
  return {type: STARRED_UPDATE, payload};
}

/** @param {import("../reducers").StarredItem[]} [payload] */
export function starredInyect(payload) {
  return {type: STARRED_INYECT, payload};
}
