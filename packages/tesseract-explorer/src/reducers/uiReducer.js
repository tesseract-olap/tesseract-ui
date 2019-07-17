import {
  UI_DEBUG_TOGGLE,
  UI_QUERY_OPTIONS_TOGGLE,
  UI_SERVER_INFO,
  UI_TABS_SELECT,
  UI_THEME_TOGGLE,
  UI_STARRED_TOGGLE,
  UITAB_TABLE
} from "../actions/ui";
import {STARRED_CREATE} from "../actions/starred";

/**
 * @typedef UiState
 * @property {boolean} darkTheme
 * @property {boolean} debugDrawer
 * @property {boolean} queryOptions
 * @property {string} serverStatus
 * @property {string} serverUrl
 * @property {string} serverVersion
 * @property {boolean} starredDrawer
 * @property {string} tab
 */

/** @type {UiState} */
export const initialState = {
  darkTheme: false,
  debugDrawer: false,
  queryOptions: false,
  serverStatus: "",
  serverUrl: "",
  serverVersion: "",
  starredDrawer: false,
  tab: UITAB_TABLE
};

/** @type {import("redux").Reducer<UiState>} */
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
      const server = action.payload;
      return {
        ...state,
        serverStatus: server.status,
        serverUrl: server.url,
        serverVersion: server.version
      };

    case UI_STARRED_TOGGLE:
      const starredDrawer = action.payload;
      return {
        ...state,
        starredDrawer:
          typeof starredDrawer === "boolean" ? starredDrawer : !state.starredDrawer
      };

    case STARRED_CREATE:
      return {...state, starredDrawer: true};

    case UI_TABS_SELECT:
      return {...state, tab: action.payload};

    case UI_THEME_TOGGLE:
      const darkTheme = !state.darkTheme;
      typeof window === "object" &&
        window.localStorage.setItem("darkTheme", darkTheme.toString());
      return {...state, darkTheme};

    default:
      return state;
  }
}

export default uiReducer;
