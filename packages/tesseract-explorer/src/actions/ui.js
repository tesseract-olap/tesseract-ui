export const UI_DEBUG_TOGGLE      = "explorer/UI/DEBUG/TOGGLE";
export const UI_LOCALELIST_UPDATE = "explorer/UI/LOCALELIST/UPDATE";
export const UI_SERVER_INFO       = "explorer/UI/SERVER_INFO";
export const UI_STARRED_TOGGLE    = "explorer/UI/STARRED/TOGGLE";
export const UI_TABS_SELECT       = "explorer/UI/TABS/SELECT";
export const UI_THEME_TOGGLE      = "explorer/UI/THEME/TOGGLE";
export const UI_INYECT            = "explorer/UI/INYECT";

export const UITAB_TABLE = "tab-table";
export const UITAB_RAW = "tab-raw";
export const UITAB_TREE = "tab-tree";

export const STATUS_FETCHING = "FETCHING";
export const STATUS_SUCCESS = "SUCCESS";
export const STATUS_FAILURE = "FAILURE";

/** @param {boolean} [payload] */
export function setDebugDrawer(payload) {
  return {type: UI_DEBUG_TOGGLE, payload};
}

/** @param {{software: string, online: boolean, url: string, version: string}} payload */
export function setServerInfo(payload) {
  return {type: UI_SERVER_INFO, payload};
}

/** @param {string} payload */
export function setTabPanel(payload) {
  return {type: UI_TABS_SELECT, payload};
}

/**  */
export function toggleDarkTheme() {
  return {type: UI_THEME_TOGGLE};
}

/**  */
export function toggleDebugDrawer() {
  return {type: UI_DEBUG_TOGGLE};
}

/** @param {boolean} [payload] */
export function toggleStarredDrawer(payload) {
  return {type: UI_STARRED_TOGGLE, payload};
}

/** @param {string[]} payload */
export function updateLocaleList(payload) {
  return {type: UI_LOCALELIST_UPDATE, payload};
}

/** @param {Partial<import("../reducers").UiState>} [payload] */
export function uiInyect(payload) {
  return {type: UI_INYECT, payload};
}
