import {STARRED_CREATE} from "../actions/starred";
import {
  UITAB_TABLE,
  UI_DEBUG_TOGGLE,
  UI_SERVER_INFO,
  UI_STARRED_TOGGLE,
  UI_TABS_SELECT,
  UI_THEME_TOGGLE
} from "../actions/ui";

/** @type {import(".").UiState} */
export const initialState = {
  darkTheme: false,
  debugDrawer: false,
  serverSoftware: "",
  serverOnline: undefined,
  serverUrl: "",
  serverVersion: "",
  starredDrawer: false,
  tab: UITAB_TABLE
};

/** @type {import("redux").Reducer<import(".").UiState>} */
function uiReducer(state = initialState, action) {
  const definedOrElse = (value, defaultValue) => (value != null ? value : defaultValue);

  switch (action.type) {
    case UI_DEBUG_TOGGLE: {
      return {
        ...state,
        debugDrawer: definedOrElse(action.payload, !state.debugDrawer)
      };
    }

    case UI_SERVER_INFO:
      const {payload: server} = action;
      return {
        ...state,
        serverSoftware: server.software,
        serverOnline: server.online,
        serverUrl: server.url,
        serverVersion: server.version
      };

    case UI_STARRED_TOGGLE:
      return {
        ...state,
        starredDrawer: definedOrElse(action.payload, !state.starredDrawer)
      };

    case UI_TABS_SELECT:
      return {...state, tab: action.payload};

    case UI_THEME_TOGGLE:
      const darkTheme = definedOrElse(action.payload, !state.darkTheme);
      typeof window === "object" &&
        window.localStorage.setItem("darkTheme", `${darkTheme}`);
      return {...state, darkTheme};

    case STARRED_CREATE:
      return {...state, starredDrawer: true};

    default:
      return state;
  }
}

export default uiReducer;
