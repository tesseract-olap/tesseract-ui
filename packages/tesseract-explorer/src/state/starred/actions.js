export const STARRED_CREATE = "explorer/STARRED/CREATE";
export const STARRED_REMOVE = "explorer/STARRED/REMOVE";
export const STARRED_UPDATE = "explorer/STARRED/UPDATE";

/**
 * @param {QueryState} query
 * @param {string} permalink
 */
export const createStarredItem = (query, permalink) => ({
  type: STARRED_CREATE,
  payload: {date: new Date().toISOString(), key: permalink, label: "", query}
});

/** @param {string} key */
export const removeStarredItem = key => ({type: STARRED_REMOVE, payload: key});

/** @param {StarredItem} item */
export const updateStarredItemLabel = item => ({type: STARRED_UPDATE, payload: item});
