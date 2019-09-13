export const UI_DEBUG_TOGGLE      = "explorer/UI/DEBUG/TOGGLE";
export const UI_LOCALELIST_UPDATE = "explorer/UI/LOCALELIST/UPDATE";
export const UI_SERVER_INFO       = "explorer/UI/SERVER_INFO";
export const UI_STARRED_TOGGLE    = "explorer/UI/STARRED/TOGGLE";
export const UI_TABS_SELECT       = "explorer/UI/TABS/SELECT";
export const UI_THEME_TOGGLE      = "explorer/UI/THEME/TOGGLE";

export const UITAB_TABLE = "tab-table";
export const UITAB_RAW = "tab-raw";
export const UITAB_TREE = "tab-tree";

const actionWrapper = (type, payload) => ({type, payload});

export const setDebugDrawer = actionWrapper.bind(null, UI_DEBUG_TOGGLE);
export const setServerInfo = actionWrapper.bind(null, UI_SERVER_INFO);
export const setTabPanel = actionWrapper.bind(null, UI_TABS_SELECT);
export const toggleDarkTheme = () => ({type: UI_THEME_TOGGLE});
export const toggleDebugDrawer = () => ({type: UI_DEBUG_TOGGLE});
export const toggleStarredDrawer = actionWrapper.bind(null, UI_STARRED_TOGGLE);
export const updateLocaleList = actionWrapper.bind(null, UI_LOCALELIST_UPDATE);
