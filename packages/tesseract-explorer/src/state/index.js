import {hydratePermalink, serializePermalink} from "../utils/permalink";
import {buildQuery} from "../utils/structs";
import {isValidQuery} from "../utils/validation";
import {loadingInitialState, loadingReducer} from "./loading/reducer";
import {queriesInitialState, queriesReducer} from "./queries/reducer";
import {serverInitialState, serverReducer} from "./server/reducer";
import {uiInitialState, uiReducer} from "./ui/reducer";

/** @type {ExplorerState} */
export const initialState = {
  explorerServer: serverInitialState,
  explorerLoading: loadingInitialState,
  explorerQueries: queriesInitialState,
  explorerUi: uiInitialState
};

/** @returns {ExplorerState} */
export function explorerInitialState() {
  const explorerQueries = {...queriesInitialState};
  const explorerUi = {...uiInitialState};

  if (typeof window === "object") {
    const locationState =
      window.location.search && hydratePermalink(window.location.search);
    const historyState = window.history.state;
    console.log(locationState);

    const defaultQuery = isValidQuery(locationState)
      ? buildQuery({params: locationState})
      : isValidQuery(historyState)
        ? buildQuery({params: historyState})
        : undefined;

    if (defaultQuery) {
      explorerQueries.current = defaultQuery.key;
      explorerQueries.itemMap = {[defaultQuery.key]: defaultQuery};
    }

    const savedDarkTheme = window.localStorage.getItem("darkTheme");
    if (typeof savedDarkTheme === "string") {
      explorerUi.darkTheme = savedDarkTheme === "true";
    }
    else if (typeof window.matchMedia === "function") {
      explorerUi.darkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  }

  return {
    ...initialState,
    explorerQueries,
    explorerUi
  };
}

/** @type {import("redux").Reducer<ExplorerState>} */
export function explorerReducer(state = initialState, action) {
  return {
    explorerServer: serverReducer(state.explorerServer, action),
    explorerLoading: loadingReducer(state.explorerLoading, action),
    explorerQueries: queriesReducer(state.explorerQueries, action),
    explorerUi: uiReducer(state.explorerUi, action)
  };
}
