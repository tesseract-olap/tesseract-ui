export const CLIENT_BUILDURLS     = "explorer/CLIENT/BUILDURLS";
export const CLIENT_CHECKSERVER   = "explorer/CLIENT/CHECKSERVER";
export const CLIENT_FETCH_FAILURE = "explorer/CLIENT/FETCH:FAILURE";
export const CLIENT_FETCH_REQUEST = "explorer/CLIENT/FETCH:REQUEST";
export const CLIENT_FETCH_SUCCESS = "explorer/CLIENT/FETCH:SUCCESS";
export const CLIENT_INITIALLOAD   = "explorer/CLIENT/INITIALLOAD";
export const CLIENT_LOADMEMBERS   = "explorer/CLIENT/LOADMEMBERS";
export const CLIENT_QUERY         = "explorer/CLIENT/QUERY";
export const CLIENT_SETCUBE       = "explorer/CLIENT/SETCUBE";
export const CLIENT_SETUP         = "explorer/CLIENT/SETUP";
export const CLIENT_HYDRATEQUERY  = "explorer/CLIENT/HYDRATEQUERY";

export const fetchMembers = cut => ({type: CLIENT_LOADMEMBERS, payload: cut});
export const buildQueryUrls = () => ({type: CLIENT_BUILDURLS});
export const runQuery = () => ({type: CLIENT_QUERY});
export const setCube = cubeName => ({type: CLIENT_SETCUBE, payload: cubeName});
export const setupClient = src => ({type: CLIENT_SETUP, src});
