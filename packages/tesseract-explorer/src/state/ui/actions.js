export const UI_DEBUG_TOGGLE = "explorer/UI/DEBUG/TOGGLE";
export const UI_LOCALELIST_UPDATE = "explorer/UI/LOCALELIST/UPDATE";
export const UI_SERVER_INFO = "explorer/UI/SERVER_INFO";
export const UI_STARRED_TOGGLE = "explorer/UI/STARRED/TOGGLE";
export const UI_TABS_SELECT = "explorer/UI/TABS/SELECT";
export const UI_THEME_TOGGLE = "explorer/UI/THEME/TOGGLE";

export const setDebugDrawer = payload => ({type: UI_DEBUG_TOGGLE, payload});
export const setServerInfo = payload => ({type: UI_SERVER_INFO, payload});
export const setTabPanel = payload => ({type: UI_TABS_SELECT, payload});
export const toggleDarkTheme = () => ({type: UI_THEME_TOGGLE});
export const toggleDebugDrawer = () => ({type: UI_DEBUG_TOGGLE});
export const toggleStarredDrawer = payload => ({type: UI_STARRED_TOGGLE, payload});
export const updateLocaleList = payload => ({type: UI_LOCALELIST_UPDATE, payload});
