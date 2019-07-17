import {initialState as queryInitialState} from "../reducers/queryReducer";
import {initialState as uiInitialState} from "../reducers/uiReducer";
import {initialState as starredInitialState} from "../reducers/starredReducer";
import {hydratePermalink, serializePermalink} from "./format";
import {isQuery, isValidQuery} from "./validation";

/** @returns {Partial<import("../reducers").ExplorerState>} */
function initialStateBuilder() {
  let explorerQuery, explorerStarred, explorerUi;

  if (typeof window === "object") {
    const locationState =
      window.location.search && hydratePermalink(window.location.search);
    const historyState = window.history.state;
    const starredState = window.localStorage.getItem("starred");

    if (isQuery(locationState)) {
      console.log("Used location", locationState);
      explorerQuery = {...queryInitialState, ...locationState};
    }
    else if (isQuery(historyState)) {
      console.log("Used history", historyState);
      explorerQuery = {...queryInitialState, ...historyState};
    }

    explorerUi = {...uiInitialState};
    const savedDarkTheme = window.localStorage.getItem("darkTheme");
    if (typeof savedDarkTheme === "string") {
      explorerUi.darkTheme = savedDarkTheme === "true";
    }
    else if (typeof window.matchMedia === "function") {
      explorerUi.darkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    explorerStarred = starredState ? JSON.parse(starredState) : starredInitialState;
  }

  let newPermalink = window.location.pathname;
  if (isValidQuery(explorerQuery)) {
    explorerQuery.permalink = serializePermalink(explorerQuery);
    newPermalink += "?" + explorerQuery.permalink;
  }
  history.replaceState(explorerQuery, "", newPermalink);

  return {
    explorerQuery,
    explorerStarred,
    explorerUi
  };
}

export default initialStateBuilder;
