import {queryInyect} from "../state/query/actions";
import {selectPermalink} from "../selectors/permalink";

/** @type {import("redux").Middleware<{}, ExplorerState>} */
function permalinkMiddleware({dispatch, getState}) {
  if (typeof window === "object") {
    window.addEventListener("popstate", function historyIntercepter(evt) {
      dispatch(queryInyect(evt.state));
    });
  }

  return next => {
    return action => {
      if (action.type.startsWith("explorer/PERMALINK") && typeof window === "object") {
        const state = getState();
        const {explorerQuery: nextQuery} = state;

        if (state.explorerCubes[nextQuery.cube] != null) {
          const nextPermalink = selectPermalink(state);

          if (window.location.search.slice(1) !== nextPermalink) {
            console.groupCollapsed("Permalink changed");
            console.log(nextQuery);
            console.groupEnd();

            const nextLocation = `${window.location.pathname}?${nextPermalink}`;
            window.history.pushState(nextQuery, "", nextLocation);
          }
        }
      }
      else {
        return next(action);
      }
    };
  };
}

export default permalinkMiddleware;
