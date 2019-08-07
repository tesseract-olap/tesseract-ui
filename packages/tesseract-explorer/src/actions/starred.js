export const STARRED_CREATE = "explorer/STARRED/CREATE";
export const STARRED_REMOVE = "explorer/STARRED/REMOVE";
export const STARRED_UPDATE = "explorer/STARRED/UPDATE";

/** @param {import("../reducers/queryReducer").QueryState} query */
export const createStarredItem = query => ({
  type: STARRED_CREATE,
  payload: {date: new Date().toISOString(), label: "", key: query.permalink, query}
});

/** @param {string} key */
export const removeStarredItem = key => ({type: STARRED_REMOVE, payload: key});

/** @param {import("../reducers").StarredItem} item */
export const updateStarredItemLabel = item => ({type: STARRED_UPDATE, payload: item});