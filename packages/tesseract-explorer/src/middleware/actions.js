export const CLIENT_BUILDURLS = "explorer/CLIENT/BUILDURLS";
export const CLIENT_DOWNLOAD = "explorer/CLIENT/DOWNLOAD";
export const CLIENT_HYDRATEQUERY = "explorer/CLIENT/HYDRATEQUERY";
export const CLIENT_LOADMEMBERS = "explorer/CLIENT/LOADMEMBERS";
export const CLIENT_PARSE = "explorer/CLIENT/PARSE";
export const CLIENT_QUERY = "explorer/CLIENT/QUERY";
export const CLIENT_SETCUBE = "explorer/CLIENT/SETCUBE";
export const CLIENT_SETLOCALE = "explorer/CLIENT/LOCALE";
export const CLIENT_SETUP = "explorer/CLIENT/SETUP";
export const PERMALINK_REFRESH = "explorer/PERMALINK/REFRESH";
export const PERMALINK_UPDATE = "explorer/PERMALINK/UPDATE";

/**  */
export const buildQueryUrls = () => ({type: CLIENT_BUILDURLS});

/** @param {TessExpl.Struct.CutItem} cut */
export const doFetchMembers = cut => ({type: CLIENT_LOADMEMBERS, payload: cut});

/** @param {string} format */
export const doDownloadQuery = format => ({type: CLIENT_DOWNLOAD, payload: format});

/**  */
export const doExecuteQuery = () => ({type: CLIENT_QUERY});

/** @param {string} url */
export const doParseQueryUrl = url => ({type: CLIENT_PARSE, payload: url});

/** @param {string} cubeName */
export const doCubeSet = cubeName => ({type: CLIENT_SETCUBE, payload: cubeName});

/** @param {string} locale */
export const doLocaleSet = locale => ({type: CLIENT_SETLOCALE, payload: locale});

/** @param {string | import("axios").AxiosRequestConfig} serverUrl */
export const doClientSetup = serverUrl => ({type: CLIENT_SETUP, payload: serverUrl});

/**  */
export const doPermalinkRefresh = () => ({type: PERMALINK_REFRESH});

/**  */
export const doPermalinkUpdate = () => ({type: PERMALINK_UPDATE});
