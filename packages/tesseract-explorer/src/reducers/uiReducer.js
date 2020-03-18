import {STARRED_CREATE} from "../actions/starred";
import {
  UI_DEBUG_TOGGLE,
  UI_LOCALELIST_UPDATE,
  UI_SERVER_INFO,
  UI_STARRED_TOGGLE,
  UI_TABS_SELECT,
  UI_THEME_TOGGLE,
  UI_INYECT
} from "../actions/ui";
import {uiInitialState} from "./initialState";

const definedOrElse = (value, defaultValue) => value != null ? value : defaultValue;

const actions = {
  [UI_INYECT]: (state, action) => ({...state, ...action.payload}),

  [UI_DEBUG_TOGGLE]: (state, action) => ({
    ...state,
    debugDrawer: definedOrElse(action.payload, !state.debugDrawer)
  }),

  [UI_SERVER_INFO]: (state, {payload}) => ({
    ...state,
    serverSoftware: payload.software,
    serverOnline: payload.online,
    serverUrl: payload.url,
    serverVersion: payload.version
  }),

  [UI_STARRED_TOGGLE]: (state, action) => ({
    ...state,
    starredDrawer: definedOrElse(action.payload, !state.starredDrawer)
  }),

  [UI_TABS_SELECT]: (state, action) => ({...state, tab: action.payload}),

  [UI_THEME_TOGGLE]: (state, action) => {
    const darkTheme = definedOrElse(action.payload, !state.darkTheme);
    typeof window === "object" &&
        window.localStorage.setItem("darkTheme", `${darkTheme}`);
    return {...state, darkTheme};
  },

  [UI_LOCALELIST_UPDATE]: (state, action) => ({...state, localeOptions: action.payload}),

  [STARRED_CREATE]: state => ({...state, starredDrawer: true})
};

/** @type {import("redux").Reducer<import(".").UiState>} */
export default function(state = uiInitialState, action) {
  const effector = actions[action.type];
  return typeof effector === "function" ? effector(state, action) : state;
}
