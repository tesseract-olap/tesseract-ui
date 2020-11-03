export const SERVER_UPDATE = "explorer/SERVER/UPDATE";
export const ENDPOINT_UPDATE = "explorer/SERVER/ENDPOINT/UPDATE";

/**
 * @param {Partial<ServerState>} payload
 */
export const doServerUpdate = payload => ({type: SERVER_UPDATE, payload});

/**
 * @param {string[]} payload
 */
export const updateLocaleList = payload => doServerUpdate({localeOptions: payload});

/**
 * @param {string} [payload]
 */
export const doUpdateEndpoint = payload => ({type: ENDPOINT_UPDATE, payload});
