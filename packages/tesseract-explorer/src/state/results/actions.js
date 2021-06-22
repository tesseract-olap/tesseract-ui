import {action} from "../helpers";
import {RESULT_UPDATE} from "./reducer";


/**
 * @param {Partial<TessExpl.Struct.QueryResult>} payload
 */
export const doCurrentResultUpdate = payload => action(RESULT_UPDATE, payload);
