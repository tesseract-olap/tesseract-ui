import {initialState as queryInitialState} from "../reducers/queryReducer";
import {initialState as uiInitialState} from "../reducers/uiReducer";
import {hydratePermalink, serializePermalink} from "./format";
import {isQuery, isValidQuery} from "./validation";

/** @returns {Partial<import("../reducers").ExplorerState>} */
function initialStateBuilder() {
  let explorerQuery, explorerUi;

  if (typeof window === "object") {
    const locationState =
      window.location.search && hydratePermalink(window.location.search);
    const historyState = window.history.state;

    if (isQuery(locationState)) {
      console.log("Used location", locationState);
      explorerQuery = {...queryInitialState, ...locationState};
    }
    else if (isQuery(historyState)) {
      console.log("Used history", historyState);
      explorerQuery = {...queryInitialState, ...historyState};
    }

    explorerUi = {...uiInitialState};
    if (typeof window.matchMedia === "function") {
      explorerUi.darkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  }

  let newPermalink = window.location.pathname;
  if (isValidQuery(explorerQuery)) {
    newPermalink += "?" + serializePermalink(explorerQuery);
  }
  history.replaceState(explorerQuery, "", newPermalink);

  return {
    explorerQuery,
    explorerUi
  };
}

export default initialStateBuilder;
