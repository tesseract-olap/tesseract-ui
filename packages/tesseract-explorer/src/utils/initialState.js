import {queryInitialState, starredInitialState, uiInitialState} from "../reducers/initialState";
import {hydratePermalink} from "./permalink";
import {isQuery, isValidQuery, validGrowthState, validRcaState, validTopkState} from "./validation";

/** @returns {Partial<import("../reducers").ExplorerState>} */
function initialStateBuilder() {
  let explorerQuery, explorerStarred, explorerUi;

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
    const savedDarkTheme = window.localStorage.getItem("darkTheme");
    if (typeof savedDarkTheme === "string") {
      explorerUi.darkTheme = savedDarkTheme === "true";
    }
    else if (typeof window.matchMedia === "function") {
      explorerUi.darkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    const starredState = window.localStorage.getItem("starred");
    explorerStarred = starredState ? JSON.parse(starredState) : starredInitialState;
  }

  if (isValidQuery(explorerQuery)) {
    if (!validGrowthState(explorerQuery.growth)) {
      explorerQuery.growth = queryInitialState.growth;
    }
    if (!validRcaState(explorerQuery.rca)) {
      explorerQuery.rca = queryInitialState.rca;
    }
    if (!validTopkState(explorerQuery.topk)) {
      explorerQuery.topk = queryInitialState.topk;
    }
  }

  return {
    explorerQuery,
    explorerStarred,
    explorerUi
  };
}

export default initialStateBuilder;
