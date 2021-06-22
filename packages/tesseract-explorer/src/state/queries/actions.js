import {QUERIES_CLEAR, QUERIES_REMOVE, QUERIES_SELECT, QUERIES_UPDATE} from "./reducer";

/**
 * @param {Record<string, TessExpl.Struct.QueryItem>} payload
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
 * @param {TessExpl.Struct.QueryItem} payload
 */
export const doQueriesUpdate = payload => ({type: QUERIES_UPDATE, payload});
