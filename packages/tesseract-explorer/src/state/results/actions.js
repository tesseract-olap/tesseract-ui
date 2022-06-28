import {action} from "../helpers";
import {RESULT_QUERY_UPDATE, RESULT_JOIN_UPDATE} from "./reducer";


/**
 * @param {Partial<TessExpl.Struct.QueryResult>} payload
 */
export const doCurrentQueryResultUpdate = payload => action(RESULT_QUERY_UPDATE, payload);

/**
 * @param {Partial<TessExpl.Struct.JoinResult>} payload
 */
export const doCurrentJoinResultUpdate = payload => action(RESULT_JOIN_UPDATE, payload);
