export const QUERIES_CLEAR = "explorer/QUERIES/CLEAR";
export const QUERIES_REMOVE = "explorer/QUERIES/REMOVE";
export const QUERIES_SELECT = "explorer/QUERIES/SELECT";
export const QUERIES_UPDATE = "explorer/QUERIES/UPDATE";

/**
 * @param {Record<string, QueryItem>} payload
 */
export const doQueriesClear = payload => ({type: QUERIES_CLEAR, payload});

/**
 * @param {string} payload queryItem.key
 */
export const doQueriesRemove = payload => ({type: QUERIES_REMOVE, payload});

/**
 * @param {string} payload
 */
export const doQueriesSelect = payload => ({type: QUERIES_SELECT, payload});

/**
 * @param {QueryItem} payload
 */
export const doQueriesUpdate = payload => ({type: QUERIES_UPDATE, payload});
