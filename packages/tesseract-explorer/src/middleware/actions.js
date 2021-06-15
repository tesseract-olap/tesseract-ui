export const CLIENT_COUNTMEMBERS = "explorer/CLIENT/COUNTMEMBERS";
export const CLIENT_DOWNLOAD = "explorer/CLIENT/DOWNLOAD";
export const CLIENT_HYDRATEQUERY = "explorer/CLIENT/HYDRATEQUERY";
export const CLIENT_LOADMEMBERS = "explorer/CLIENT/LOADMEMBERS";
export const CLIENT_PARSE = "explorer/CLIENT/PARSE";
export const CLIENT_QUERY = "explorer/CLIENT/QUERY";
export const CLIENT_SETCUBE = "explorer/CLIENT/SETCUBE";
export const CLIENT_SETLOCALE = "explorer/CLIENT/LOCALE";
export const CLIENT_SETUP = "explorer/CLIENT/SETUP";
export const PERMALINK_PARSE = "explorer/PERMALINK/PARSE";
export const PERMALINK_REFRESH = "explorer/PERMALINK/REFRESH";
export const PERMALINK_UPDATE = "explorer/PERMALINK/UPDATE";

/** @param {OlapClient.PlainLevel} level */
export const doDrilldownCreate = level => ({type: CLIENT_COUNTMEMBERS, payload: level});

/**
 * @param {string} format
 * @returns {Promise<TessExpl.Struct.FileDescriptor>}
 */
export const doDownloadQuery = (dispatch, format) =>
  dispatch({type: CLIENT_DOWNLOAD, payload: format});

/**
 * Orders the middleware to take the current parameters and query the
 * OLAP server for data with them.
 */
export const doExecuteQuery = () => ({type: CLIENT_QUERY});

/**
 * @param {TessExpl.Struct.CutItem} cut
 * @returns {Promise<TessExpl.Struct.MemberRecords>}
 */
export const doFetchMembers = (dispatch, cut) =>
  dispatch({type: CLIENT_LOADMEMBERS, payload: cut});

/** @param {string | URL} url */
export const doParseQueryUrl = url => ({type: CLIENT_PARSE, payload: `${url}`});

/** @param {string} cubeName */
export const doCubeSet = cubeName => ({type: CLIENT_SETCUBE, payload: cubeName});

/** @param {string} locale */
export const doLocaleSet = locale => ({type: CLIENT_SETLOCALE, payload: locale});

/** @param {OlapClient.ServerConfig} serverConfig */
export const doClientSetup = serverConfig => ({type: CLIENT_SETUP, payload: serverConfig});

/**
 * Orders the middleware to attempt to get a queryItem from the browser's API,
 * and replace the current query with it if it founds one.
 */
export const doPermalinkParse = () => ({type: PERMALINK_PARSE});

/**  */
export const doPermalinkRefresh = () => ({type: PERMALINK_REFRESH});

/**  */
export const doPermalinkUpdate = () => ({type: PERMALINK_UPDATE});
