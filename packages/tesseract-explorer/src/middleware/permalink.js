import {doRawInyect} from "../state/params/actions";
import {selectCurrentQueryItem} from "../state/queries/selectors";
import {selectOlapCubeMap} from "../state/server/selectors";
import {selectPermalink} from "./selectors";

/** @type {import("redux").Middleware<{}, ExplorerState>} */
function permalinkMiddleware({dispatch, getState}) {
  if (typeof window === "object") {
    window.addEventListener("popstate", evt => {
      dispatch(doRawInyect(evt.state));
    });
  }

  return next => action => {
    if (action.type.startsWith("explorer/PERMALINK") && typeof window === "object") {
      const state = getState();
      const cubeMap = selectOlapCubeMap(state);
      const {params} = selectCurrentQueryItem(state);

      if (cubeMap[params.cube] != null) {
        const nextPermalink = selectPermalink(state);

        if (window.location.search.slice(1) !== nextPermalink) {
          console.groupCollapsed("Permalink changed");
          console.log(params);
          console.groupEnd();

          const nextLocation = `${window.location.pathname}?${nextPermalink}`;
          window.history.pushState(params, "", nextLocation);
        }
      }
      return undefined;
    }
    else {
      return next(action);
    }
  };
}

export default permalinkMiddleware;
