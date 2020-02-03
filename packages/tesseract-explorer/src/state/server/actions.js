export const SERVER_UPDATE = "explorer/SERVER/UPDATE";

/**
 * @param {Partial<ServerState>} payload
 */
export const doServerUpdate = payload => ({type: SERVER_UPDATE, payload});

/**
 * @param {string[]} payload
 */
export const updateLocaleList = payload => doServerUpdate({localeOptions: payload});
