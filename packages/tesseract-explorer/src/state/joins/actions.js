import {JOINS_CLEAR, JOINS_REMOVE, JOINS_SELECT, JOINS_UPDATE} from "./reducer";

/**
 * @param {Record<string, TessExpl.Struct.QueryItem>} payload
 */
export const doJoinsClear = payload => ({type: JOINS_CLEAR, payload});

/**
 * @param {string} payload queryItem.key
 */
export const doJoinsRemove = payload => ({type: JOINS_REMOVE, payload});

/**
 * @param {string} payload
 */
export const doJoinsSelect = payload => ({type: JOINS_SELECT, payload});

/**
 * @param {TessExpl.Struct.QueryItem} payload
 */
export const doJoinsUpdate = payload => ({type: JOINS_UPDATE, payload});
