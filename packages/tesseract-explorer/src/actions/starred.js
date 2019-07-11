export const STARRED_CREATE = "explorer/STARRED/CREATE";
export const STARRED_REMOVE = "explorer/STARRED/REMOVE";

/**
 * @param {import("../reducers/queryReducer").QueryState} query
 * @param {string} key
 */
export const createStarredItem = (query, key) => ({
  type: STARRED_CREATE,
  payload: {date: new Date().toISOString(), key, query}
});

/**
 * @param {string} key
 */
export const removeStarredItem = key => ({type: STARRED_REMOVE, payload: key});
