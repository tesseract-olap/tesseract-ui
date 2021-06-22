import {ENDPOINT_UPDATE, SERVER_UPDATE} from "./reducer";

/**
 * Updates the application state with the current status of the OLAP server.
 * @param {Partial<TessExpl.State.ServerState>} payload
 */
export const doServerUpdate = payload => ({type: SERVER_UPDATE, payload});

/**
 * Updates the application state with the list of locales available to query
 * on the OLAP server.
 * @param {string[]} payload
 */
export const updateLocaleList = payload => doServerUpdate({localeOptions: payload});

/**
 * Updates the application state with the endpoint the middleware must use to
 * execute queries.
 * @param {string} [payload]
 */
export const doUpdateEndpoint = payload => ({type: ENDPOINT_UPDATE, payload});
