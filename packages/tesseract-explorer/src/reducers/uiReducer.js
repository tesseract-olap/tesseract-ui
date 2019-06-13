import {
  UI_DEBUG_TOGGLE,
  UI_QUERY_OPTIONS_TOGGLE,
  UI_SERVER_INFO,
  UI_TABS_SELECT,
  UI_THEME_TOGGLE,
  UI_STARRED_TOGGLE
} from "../actions/ui";

export const TAB_TABLE = "tab-table";
export const TAB_RAW = "tab-raw";
export const TAB_TREE = "tab-tree";

const initialState = {
  darkTheme: false,
  debugDrawer: false,
  queryOptions: false,
  serverStatus: "",
  serverUrl: "",
  serverVersion: "",
  starredDrawer: false,
  tab: TAB_TABLE
};

function uiReducer(state = initialState, action) {
  switch (action.type) {
    case UI_DEBUG_TOGGLE:
      return {
        ...state,
        debugDrawer: "payload" in action ? action.payload : !state.debugDrawer
      };

    case UI_QUERY_OPTIONS_TOGGLE:
      return {...state, queryOptions: !state.queryOptions};

    case UI_SERVER_INFO:
      return {
        ...state,
        serverStatus: action.payload.status,
        serverUrl: action.payload.url,
        serverVersion: action.payload.version
      };

    case UI_STARRED_TOGGLE:
      return {
        ...state,
        starredDrawer: "payload" in action ? action.payload : !state.starredDrawer
      };

    case UI_TABS_SELECT:
      return {...state, tab: action.payload};

    case UI_THEME_TOGGLE:
      return {...state, darkTheme: !state.darkTheme};

    default:
      return state;
  }
}

export default uiReducer;
