import {UI_DEBUG_TOGGLE, UI_STARRED_TOGGLE, UI_THEME_TOGGLE} from "./actions";

/** @type {TessExpl.State.UiState} */
export const uiInitialState = {
  darkTheme: false,
  debugDrawer: false,
  starredDrawer: false
};

/** @type {import("redux").Reducer<TessExpl.State.UiState>} */
export function uiReducer(state = uiInitialState, action) {
  const effector = effects[action.type];
  if (effector) {
    const newState = effector(state, action.payload);
    if (storableActions.includes(action.type) && typeof window === "object") {
      window.localStorage.setItem(
        "ui",
        JSON.stringify({
          darkTheme: newState.darkTheme
        })
      );
    }
    return newState;
  }
  return state;
}

const storableActions = [UI_THEME_TOGGLE];

const definedOrElse = (value, defaultValue) => value != null ? value : defaultValue;

/** @type {Record<string, (state: TessExpl.State.UiState, payload: any) => TessExpl.State.UiState>} */
const effects = {
  [UI_DEBUG_TOGGLE]: (state, payload) => ({
    ...state,
    debugDrawer: definedOrElse(payload, !state.debugDrawer)
  }),

  [UI_STARRED_TOGGLE]: (state, payload) => ({
    ...state,
    starredDrawer: definedOrElse(payload, !state.starredDrawer)
  }),

  [UI_THEME_TOGGLE]: (state, payload) => ({
    ...state,
    darkTheme: definedOrElse(payload, !state.darkTheme)
  })
};
